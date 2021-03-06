#coding: utf-8
#ロケーションシステム用RaspberryPiプログラム

import time
import os,socket
import struct
from time import sleep
import urllib,urllib2
import fcntl
import datetime
import json
import threading
import serial
import subprocess
import requests

VERSION_NO = "1.0b"
INTERVAL = 10	#送信インターバル初期値 単位 sec
SLEEPTIME = 1 #永久ループのスリープ時間 単位 sec
TEST_INT = 1   #(テスト用)インターバルを10:1/10[60s] 20:1/20[30s] 30:1/30[20s] 60:1/60[10s]

#グローバル変数
g_macAddr = 0			#MACアドレス保存用
g_sendInterval = 10		#送信インターバル(秒)
g_cmpTime = 0			#時間経過比較用時刻
port = 0
config_file = '/home/pi/sensor_config.txt'
gpgaa = ""

url = ''
#url = 'http://157.7.222.217:8081/nsl1.php'
#url = 'http://kcs2000.info/remos/ajaxlib.php'

class DetectThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
    def run(self):
        global lat_lng
        while True:
            checkData(readData())  #装置からデータ取得

#
# センサー設定ファイルの読み込み
# ~/sensor_config.txt
#
def readConfig(fname):
    lines = [];
    for line in open(fname, 'r'):
        config = line[:-1].split('\t')
        print config
        lines.append(config)
    return lines

#
# 設定値の取得
# configs 設定リスト
# name 所得する設定名
def getConfig(configs, name):
    value = "";
    for config in configs:
        if config[0].find(name) > -1:
            v = config[0].split('=')
            if len(v) == 2:
                value = v[1].strip()
    return value

#
# MACアドレスの取得
#  IN: インターフェース名 ex)"eht0" "wlan0"
#
def getMacAddr(ifname):

    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    info = fcntl.ioctl(s.fileno(), 0x8927,  struct.pack('256s', ifname[:15]))
    return ''.join(['%02x:' % ord(char) for char in info[18:24]])[:-1]


def getDatetime():

    datet = datetime.datetime.today()     #現在日付・時刻のdatetime型データの変数を取得
    return datet.strftime("%Y-%m-%d %H:%M:%S")

#
# RaspberryPiのシリアル番号取得
#
def getSerial():
  # Extract serial from cpuinfo file
  cpuserial = "0000000000000000"
  try:
    f = open('/proc/cpuinfo','r')
    for line in f:
      if line[0:6]=='Serial':
        cpuserial = line[10:26]
    f.close()
  except:
    cpuserial = "ERROR000000000"

  return cpuserial

#
# 装置データ取得
#  OUT: 取得データ
#
def readData():
    global port
    values = []
    port.write('req\r\n') # 正式には\r\nにする
    str = port.readline()  # 行終端'\n'までリードする
    # Debug
    #str = "a:1,b:10,c:20,d:30,e:40,f:50,g:60"
    #str = "a:1,b:10,y:20,z:30"
    print "取得データ: %s " % str + "[len=%d]" % len(str)
#    if len(str) > 0:
#        values = str.split(',')
    return str

#
# 取得データからサーバに送信するデータを抽出する
#
def checkData(values):
    global gpgaa
    rtn_valuse = []
#    if values[0:7]=='$GPGLL,':
#        return parseGPGLL(values)
#    else:
#        return rtn_valuse
    if values[0:7]=='$GPGGA,':
        gpgaa = values

def parseGPGLL(values):
    v = []
    print 'parseGPGLL:%s' % values
    v = values.split(',')
    if len(v) == 8 and v[6] =='A':
        v[1] = float(v[1]) / 100
        v[3] = float(v[3]) / 100
        return v
    else:
        return []

def parseGPGGA(values):
    v = []
    print 'parseGPGGA:%s' % values
    v = values.split(',')
    if len(v) == 15 and v[6] != '0':
        v[2] = float(v[2]) / 100
        v[4] = float(v[4]) / 100
        return v
    else:
        return []

def main():

    global g_macAddr
    global g_sendInterval
    global g_cmpTime
    global port
    global gpgaa

    print "Version : " + VERSION_NO
    config = readConfig(config_file)
    sensor_no = getSerial()
    serial_port = getConfig(config,"serial_port")
    url = getConfig(config,"post_url")
    g_cmpTime = time.time()

    #g_macAddr = getMacAddr("wwan0")
    #print "<<%s>>" % g_macAddr
    firstboot = 1
    headers ={
        "pragma":"no-cache",
    }
    port = serial.Serial(serial_port,
                      baudrate=9600,
                      #bytesize=serial.SEVENBITS,
                      bytesize=serial.EIGHTBITS,
                      parity=serial.PARITY_NONE,
                      stopbits=serial.STOPBITS_ONE,
                      timeout=5.0)
    #スレッド起動
    thread1 = DetectThread()
    thread1.start()
    #t=threading.Thread(target=brink_led)
    #t.start()
    #無限ループ
    while True:
        #10秒毎に温度湿度を計測して送信する
        if( g_cmpTime+g_sendInterval < time.time()):
            if gpgaa != "" :
                lat_lng = parseGPGGA(gpgaa)
                if len(lat_lng) == 15:
                    try:
                        res_data = requests.post(url,{'location_id':0,'serialno': sensor_no, 'latitude':lat_lng[2],'longitude':lat_lng[4],'altitude':lat_lng[9],'utc':lat_lng[1]})
                        gpgaa = ""
                        print "SEND DATA:%s" % sensor_no + " latitude:%s" % lat_lng[1] + " longitude:%s" % lat_lng[3] + "altitude:%s" % lat_lng[9] + " UTC:%s" % lat_lng[1]
                        print res_data,     #,で改行されない
                        print '\r'
                    except requests.ConnectionError, e:
                        print e
                    g_cmpTime = time.time()

    port.close()

if __name__ == '__main__':
  main()

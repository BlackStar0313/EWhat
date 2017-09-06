#!/bin/bash

cd py
python dataPacker.py -d ../data/ -t ../text.xls -o ../../EWhat/resource/data.json -c ../../EWhat/src/Constants.ts -s ../../EWhat/src/text.ts -j ../../EWhat/resource/text.json -i ../../EWhat/src/data/interface/


#python3 sqlPacker.py -d ../data/  -c db.conf -o ../sql

#echo "[***Debug***] merge update sql to one file..."
#cat ../sql/update_*.sql > ../sql/update.sql
#echo "[***Debug***] merge replace sql to one file..."
#cat ../sql/replace_*.sql > ../sql/replace.sql
#echo "[***Debug***] merge delete sql to one file..."
#cat ../sql/delete_*.sql > ../sql/delete.sql

cd -

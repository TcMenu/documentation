#!/usr/bin/env bash

function usage() {
  echo "Error: $1"
  echo "$0 P|W"
  echo "       W|P either W for win subsystem or P for prod"
  exit 1
}

if [ "$#" -ne 1 ]; then
  usage "Incorrect number of parameters"
fi

if [ "$1" == "P" ]; then
  echo "Document generator running in production"
  export TC_MENU_DIR="/home/ubuntu/source/tcMenu"
  export ARDUINO_LIBS="/home/ubuntu/source/libraries"
  export DOXY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
  export WEB_DIR="/var/www/tcc-refdocs"
  git pull "$TC_MENU_DIR"
  git submodule update --checkout
elif [ "$1" == "W" ]; then
  echo "Document generator running in Win Linux subsystem"
  export ARDUINO_LIBS="/mnt/c/Users/dave/Documents/Arduino/libraries"
  export TC_MENU_DIR="/mnt/c/Users/dave/IdeaProjects/tcMenu"
  export DOXY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
  export WEB_DIR="/mnt/c/Users/dave/IdeaProjects/hugo-content/tcc-hugo/static/"
else
  usage "Parameter 2 can only be P or W"
  exit 1
fi

echo "Doxygen file directory is ${DOXY_DIR}"

echo "Performing backup"
cd $WEB_DIR || exit
rm /tmp/ref-docs.zip
zip -r /tmp/ref-docs.zip .

echo "Updating TaskManagerIO docs"
cd $ARDUINO_LIBS/TaskManagerIO || exit
git pull
mkdir -p $WEB_DIR/ref-docs/taskmanagerio
doxygen $DOXY_DIR/taskmgr-doxygen.conf

echo "Updating IoAbstraction docs"
cd $ARDUINO_LIBS/IoAbstraction || exit
git pull
mkdir -p $WEB_DIR/ref-docs/ioabstraction
doxygen $DOXY_DIR/ioa-doxygen.conf

echo "Updating LiquidCrystalIO docs"
cd $ARDUINO_LIBS/LiquidCrystalIO || exit
git pull
mkdir -p $WEB_DIR/ref-docs/liquidcrystalio
doxygen $DOXY_DIR/liquidio-doxygen.conf

echo "Updating SimpleCollections docs"
cd $ARDUINO_LIBS/SimpleCollections || exit
git pull
mkdir -p $WEB_DIR/ref-docs/simple-collections
doxygen $DOXY_DIR/simple-collections.conf

echo "Updating TcUnicodeHelper docs"
cd $ARDUINO_LIBS/tcUnicodeHelper || exit
git pull
mkdir -p $WEB_DIR/ref-docs/tc-unicode-helper
doxygen $DOXY_DIR/tc-unicode-helper.conf


echo "Updating TcMenu docs"
cd $ARDUINO_LIBS/tcMenu || exit
mkdir -p $WEB_DIR/ref-docs/tcmenu
doxygen $DOXY_DIR/tcmenu-doxygen.conf

#echo "Updating tcMenuJavaAPI docs"
cd $TC_MENU_DIR/tcMenuJavaApi || exit
mkdir -p $WEB_DIR/ref-docs/tcmenujavaapi
doxygen $DOXY_DIR/tcmenu-api-doxygen.conf

#echo "Updating embedCONTROLCore docs"
cd $TC_MENU_DIR/embedCONTROLCore || exit
mkdir -p $WEB_DIR/ref-docs/embedcontrol-core
doxygen $DOXY_DIR/embedCONTROLCore.conf

echo "All sources regenerated, check over them now to ensure they are serving correctly"
echo "Output directory for reference is ${WEB_DIR}"
echo "Backup is in /tmp/ref-docs.zip should it be needed"

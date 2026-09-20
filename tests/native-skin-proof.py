# Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
"""Run with the product's Qt Python: native-skin-proof.py PRODUCT_ROOT [extra skins...]."""
import os,sys,tempfile
from pathlib import Path
from unittest.mock import patch
os.environ['QT_QPA_PLATFORM']='offscreen'
sys.path.insert(0,str(Path(sys.argv[1]).resolve()/'apps/native'))
from PySide6.QtWidgets import QApplication
from augmentor_linux.skins import read_skin
from augmentor_linux.preferences import Preferences
from augmentor_linux.surfaces import AppearanceDialog
from augmentor_linux.window import Window
app=QApplication([])
paths=list((Path(__file__).resolve().parents[1]/'assets/skins').glob('*.json'))+[Path(p) for p in sys.argv[2:]]
for path in paths:
 document=read_skin(path)
 dialog=AppearanceDialog(Preferences(False).values)
 with patch('augmentor_linux.surfaces.QFileDialog.getOpenFileName',return_value=(str(path),'')),patch('augmentor_linux.surfaces.QInputDialog.getText',return_value=(document['name']+' imported',True)),patch('augmentor_linux.surfaces.QMessageBox.warning') as warning:
  dialog.import_skin();warning.assert_not_called()
 for key,value in document['appearance'].items():assert dialog.values[key]==value,key
 window=Window(preview=True);window.apply_appearance(document['appearance']);window.show();app.processEvents();assert not window.grab().isNull()
 window.close();dialog.close();print('PASS native import dialog and render:',path.name)

###
# written in python 2.7.12
# for python >3 you might have to switch out "raw_input()" with "input()"
#
# Usage:
#
# for adding a key value pair to the language files in this folder :
#
# 		python edit_keys.py
#
# 		-> Enter the key you wish to add
#		-> Enter the value for the key
#
# for removing a specific key value pair :
#
#		python edit_keys.py rm
#
# 		-> Enter key to remove (case sensitive!)
#
# having trouble? Message me: amandusbutzer@gmx.de
###

import json, os, sys
from collections import OrderedDict

# look for rm argument and assign bool to remove
try :
	if sys.argv[1] == 'rm' :
		remove = True
except IndexError:
	remove = False

# respective input message
key =  raw_input("Enter the key to remove: ") if remove else raw_input("Enter the key to add: ") # 'COLOR_ROUTE'

# only for adding
if not remove :
	value = raw_input("Enter english translation for key: ") #'Color route with'

# open .json only
for file in os.listdir(os.getcwd()) :
	if file[-5:] == ".json" :

		#open file to read
		with open(file, 'r') as f :

			# parse json to python dictionary
			DataDict = json.loads(f.read(), object_pairs_hook = OrderedDict)
			if not key in DataDict :
				if remove :
					print file + ' has no"'  + key + '" key to remove!'
				else :

					# add the key value pair
					DataDict[key] = value
					f.close()

					# parse back to json and overwrite old file
					with open(file, 'w') as f :
						f.write(json.dumps(DataDict, indent = 4, ensure_ascii = False, separators=(',', ': ')).encode('utf-8'))
						f.write('\n')
						print '"' + key + '": "' + DataDict[key] + '" written to ' + file
			else :
				if remove :

					# remove key value pair
					del DataDict[key]

					f.close()
					# parse back to json and overwrite old file
					with open(file, 'w') as f :
						f.write(json.dumps(DataDict, indent = 4, ensure_ascii = False, separators=(',', ': ')).encode('utf-8'))
						f.write('\n')
						print '"' + key + '"' + ' has ben removed from ' + file
				else:
					print file + ' already has "'  + key + '" key!'
			f.close()

EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title "CNC plotter"
Date "2022-08-15"
Rev ""
Comp "Michał Szopiński"
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L Regulator_Linear:L7805 U2
U 1 1 62FABA28
P 3200 1150
F 0 "U2" H 3200 1392 50  0000 C CNN
F 1 "L7805" H 3200 1301 50  0000 C CNN
F 2 "Package_TO_SOT_THT:TO-220-3_Vertical" H 3225 1000 50  0001 L CIN
F 3 "http://www.st.com/content/ccc/resource/technical/document/datasheet/41/4f/b3/b0/12/d4/47/88/CD00000444.pdf/files/CD00000444.pdf/jcr:content/translations/en.CD00000444.pdf" H 3200 1100 50  0001 C CNN
	1    3200 1150
	1    0    0    -1  
$EndComp
$Comp
L Connector:Barrel_Jack J1
U 1 1 62FAD583
P 1350 1250
F 0 "J1" H 1407 1575 50  0000 C CNN
F 1 "Barrel_Jack" H 1407 1484 50  0000 C CNN
F 2 "Connector_BarrelJack:BarrelJack_Horizontal" H 1400 1210 50  0001 C CNN
F 3 "~" H 1400 1210 50  0001 C CNN
	1    1350 1250
	1    0    0    -1  
$EndComp
Wire Wire Line
	3200 1450 3200 1850
Wire Wire Line
	3200 1850 2500 1850
Wire Wire Line
	1650 1850 1650 1350
Connection ~ 3200 1850
$Comp
L Device:CP C1
U 1 1 62FB0F2F
P 2500 1500
F 0 "C1" H 2618 1546 50  0000 L CNN
F 1 "100u" H 2618 1455 50  0000 L CNN
F 2 "Capacitor_THT:CP_Radial_D6.3mm_P2.50mm" H 2538 1350 50  0001 C CNN
F 3 "~" H 2500 1500 50  0001 C CNN
	1    2500 1500
	1    0    0    -1  
$EndComp
Wire Wire Line
	2500 1350 2500 1150
Connection ~ 2500 1150
Wire Wire Line
	2500 1150 2900 1150
Wire Wire Line
	2500 1650 2500 1850
Connection ~ 2500 1850
Wire Wire Line
	1650 1850 2050 1850
$Comp
L power:+5V #PWR0102
U 1 1 62FB5251
P 4200 950
F 0 "#PWR0102" H 4200 800 50  0001 C CNN
F 1 "+5V" H 4215 1123 50  0000 C CNN
F 2 "" H 4200 950 50  0001 C CNN
F 3 "" H 4200 950 50  0001 C CNN
	1    4200 950 
	1    0    0    -1  
$EndComp
$Comp
L power:PWR_FLAG #FLG0102
U 1 1 62FB5E04
P 2050 1850
F 0 "#FLG0102" H 2050 1925 50  0001 C CNN
F 1 "PWR_FLAG" H 2050 2023 50  0000 C CNN
F 2 "" H 2050 1850 50  0001 C CNN
F 3 "~" H 2050 1850 50  0001 C CNN
	1    2050 1850
	1    0    0    -1  
$EndComp
Connection ~ 2050 1850
Wire Wire Line
	2050 1850 2500 1850
Wire Wire Line
	2500 950  2500 1150
$Comp
L Device:C C2
U 1 1 62FB7032
P 4200 1500
F 0 "C2" H 4315 1546 50  0000 L CNN
F 1 "100n" H 4315 1455 50  0000 L CNN
F 2 "Capacitor_THT:C_Disc_D6.0mm_W4.4mm_P5.00mm" H 4238 1350 50  0001 C CNN
F 3 "~" H 4200 1500 50  0001 C CNN
	1    4200 1500
	1    0    0    -1  
$EndComp
Wire Wire Line
	4200 1650 4200 1850
$Comp
L power:GND #PWR0104
U 1 1 62FB871B
P 3200 2100
F 0 "#PWR0104" H 3200 1850 50  0001 C CNN
F 1 "GND" H 3205 1927 50  0000 C CNN
F 2 "" H 3200 2100 50  0001 C CNN
F 3 "" H 3200 2100 50  0001 C CNN
	1    3200 2100
	1    0    0    -1  
$EndComp
Wire Wire Line
	3200 2100 3200 1850
Wire Wire Line
	4200 950  4200 1150
Connection ~ 4200 1150
Wire Wire Line
	4200 1150 4200 1350
Wire Wire Line
	4200 1850 3200 1850
$Comp
L Device:CP C5
U 1 1 630194BC
P 6400 1500
F 0 "C5" V 6145 1500 50  0000 C CNN
F 1 "100u" V 6236 1500 50  0000 C CNN
F 2 "Capacitor_THT:CP_Radial_D6.3mm_P2.50mm" H 6438 1350 50  0001 C CNN
F 3 "~" H 6400 1500 50  0001 C CNN
	1    6400 1500
	0    1    1    0   
$EndComp
Connection ~ 6550 1500
Wire Wire Line
	6550 1500 6550 1800
Wire Wire Line
	6550 1200 6550 1500
Wire Wire Line
	6250 1500 6100 1500
Wire Wire Line
	6100 1500 6100 1650
$Comp
L power:GND #PWR0111
U 1 1 6301BDD3
P 6100 1650
F 0 "#PWR0111" H 6100 1400 50  0001 C CNN
F 1 "GND" H 6105 1477 50  0000 C CNN
F 2 "" H 6100 1650 50  0001 C CNN
F 3 "" H 6100 1650 50  0001 C CNN
	1    6100 1650
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0112
U 1 1 6301C350
P 6650 3150
F 0 "#PWR0112" H 6650 2900 50  0001 C CNN
F 1 "GND" H 6655 2977 50  0000 C CNN
F 2 "" H 6650 3150 50  0001 C CNN
F 3 "" H 6650 3150 50  0001 C CNN
	1    6650 3150
	1    0    0    -1  
$EndComp
Wire Wire Line
	6650 3150 6650 3000
Wire Wire Line
	6550 2900 6550 3000
Wire Wire Line
	6550 3000 6650 3000
Connection ~ 6650 3000
Wire Wire Line
	6650 3000 6650 2900
$Comp
L Connector_Generic:Conn_01x04 J4
U 1 1 63024C3F
P 7200 1400
F 0 "J4" V 7164 1112 50  0000 R CNN
F 1 "Conn_01x04" V 7073 1112 50  0000 R CNN
F 2 "Connector_Molex:Molex_KK-254_AE-6410-04A_1x04_P2.54mm_Vertical" H 7200 1400 50  0001 C CNN
F 3 "~" H 7200 1400 50  0001 C CNN
	1    7200 1400
	0    -1   -1   0   
$EndComp
Wire Wire Line
	7100 1600 7100 1800
Wire Wire Line
	7200 1800 7200 1600
Wire Wire Line
	7300 1600 7300 1800
Wire Wire Line
	7400 1800 7400 1600
Wire Wire Line
	7200 2900 7200 3000
Wire Wire Line
	7200 3000 7300 3000
Wire Wire Line
	7400 3000 7400 2900
Wire Wire Line
	7300 2900 7300 3000
Connection ~ 7300 3000
Wire Wire Line
	7300 3000 7400 3000
Wire Wire Line
	7400 3000 7750 3000
Wire Wire Line
	7750 3000 7750 2800
Connection ~ 7400 3000
$Comp
L power:+5V #PWR0113
U 1 1 6302AF43
P 7750 2800
F 0 "#PWR0113" H 7750 2650 50  0001 C CNN
F 1 "+5V" H 7765 2973 50  0000 C CNN
F 2 "" H 7750 2800 50  0001 C CNN
F 3 "" H 7750 2800 50  0001 C CNN
	1    7750 2800
	1    0    0    -1  
$EndComp
$Comp
L Device:CP C7
U 1 1 6303BF4D
P 9300 1500
F 0 "C7" V 9045 1500 50  0000 C CNN
F 1 "100u" V 9136 1500 50  0000 C CNN
F 2 "Capacitor_THT:CP_Radial_D6.3mm_P2.50mm" H 9338 1350 50  0001 C CNN
F 3 "~" H 9300 1500 50  0001 C CNN
	1    9300 1500
	0    1    1    0   
$EndComp
Connection ~ 9450 1500
Wire Wire Line
	9450 1500 9450 1800
Wire Wire Line
	9450 1200 9450 1500
Wire Wire Line
	9150 1500 9000 1500
Wire Wire Line
	9000 1500 9000 1650
$Comp
L power:GND #PWR0115
U 1 1 6303BF58
P 9000 1650
F 0 "#PWR0115" H 9000 1400 50  0001 C CNN
F 1 "GND" H 9005 1477 50  0000 C CNN
F 2 "" H 9000 1650 50  0001 C CNN
F 3 "" H 9000 1650 50  0001 C CNN
	1    9000 1650
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0116
U 1 1 6303BF5E
P 9550 3150
F 0 "#PWR0116" H 9550 2900 50  0001 C CNN
F 1 "GND" H 9555 2977 50  0000 C CNN
F 2 "" H 9550 3150 50  0001 C CNN
F 3 "" H 9550 3150 50  0001 C CNN
	1    9550 3150
	1    0    0    -1  
$EndComp
Wire Wire Line
	9550 3150 9550 3000
Wire Wire Line
	9450 2900 9450 3000
Wire Wire Line
	9450 3000 9550 3000
Connection ~ 9550 3000
Wire Wire Line
	9550 3000 9550 2900
$Comp
L Connector_Generic:Conn_01x04 J6
U 1 1 6303BF69
P 10100 1400
F 0 "J6" V 10064 1112 50  0000 R CNN
F 1 "Conn_01x04" V 9973 1112 50  0000 R CNN
F 2 "Connector_Molex:Molex_KK-254_AE-6410-04A_1x04_P2.54mm_Vertical" H 10100 1400 50  0001 C CNN
F 3 "~" H 10100 1400 50  0001 C CNN
	1    10100 1400
	0    -1   -1   0   
$EndComp
Wire Wire Line
	10000 1600 10000 1800
Wire Wire Line
	10100 1800 10100 1600
Wire Wire Line
	10200 1600 10200 1800
Wire Wire Line
	10300 1800 10300 1600
Wire Wire Line
	10100 2900 10100 3000
Wire Wire Line
	10100 3000 10200 3000
Wire Wire Line
	10300 3000 10300 2900
Wire Wire Line
	10200 2900 10200 3000
Connection ~ 10200 3000
Wire Wire Line
	10200 3000 10300 3000
Wire Wire Line
	10300 3000 10650 3000
Wire Wire Line
	10650 3000 10650 2800
Connection ~ 10300 3000
$Comp
L power:+5V #PWR0117
U 1 1 6303BF82
P 10650 2800
F 0 "#PWR0117" H 10650 2650 50  0001 C CNN
F 1 "+5V" H 10665 2973 50  0000 C CNN
F 2 "" H 10650 2800 50  0001 C CNN
F 3 "" H 10650 2800 50  0001 C CNN
	1    10650 2800
	1    0    0    -1  
$EndComp
$Comp
L Device:CP C6
U 1 1 63053EE8
P 6400 4100
F 0 "C6" V 6145 4100 50  0000 C CNN
F 1 "100u" V 6236 4100 50  0000 C CNN
F 2 "Capacitor_THT:CP_Radial_D6.3mm_P2.50mm" H 6438 3950 50  0001 C CNN
F 3 "~" H 6400 4100 50  0001 C CNN
	1    6400 4100
	0    1    1    0   
$EndComp
Connection ~ 6550 4100
Wire Wire Line
	6550 4100 6550 4400
Wire Wire Line
	6550 3800 6550 4100
Wire Wire Line
	6250 4100 6100 4100
Wire Wire Line
	6100 4100 6100 4250
$Comp
L power:GND #PWR0119
U 1 1 63053EF3
P 6100 4250
F 0 "#PWR0119" H 6100 4000 50  0001 C CNN
F 1 "GND" H 6105 4077 50  0000 C CNN
F 2 "" H 6100 4250 50  0001 C CNN
F 3 "" H 6100 4250 50  0001 C CNN
	1    6100 4250
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0120
U 1 1 63053EF9
P 6650 5750
F 0 "#PWR0120" H 6650 5500 50  0001 C CNN
F 1 "GND" H 6655 5577 50  0000 C CNN
F 2 "" H 6650 5750 50  0001 C CNN
F 3 "" H 6650 5750 50  0001 C CNN
	1    6650 5750
	1    0    0    -1  
$EndComp
Wire Wire Line
	6650 5750 6650 5600
Wire Wire Line
	6550 5500 6550 5600
Wire Wire Line
	6550 5600 6650 5600
Connection ~ 6650 5600
Wire Wire Line
	6650 5600 6650 5500
$Comp
L Connector_Generic:Conn_01x04 J5
U 1 1 63053F04
P 7200 4000
F 0 "J5" V 7164 3712 50  0000 R CNN
F 1 "Conn_01x04" V 7073 3712 50  0000 R CNN
F 2 "Connector_Molex:Molex_KK-254_AE-6410-04A_1x04_P2.54mm_Vertical" H 7200 4000 50  0001 C CNN
F 3 "~" H 7200 4000 50  0001 C CNN
	1    7200 4000
	0    -1   -1   0   
$EndComp
Wire Wire Line
	7100 4200 7100 4400
Wire Wire Line
	7200 4400 7200 4200
Wire Wire Line
	7300 4200 7300 4400
Wire Wire Line
	7400 4400 7400 4200
Wire Wire Line
	7200 5500 7200 5600
Wire Wire Line
	7200 5600 7300 5600
Wire Wire Line
	7400 5600 7400 5500
Wire Wire Line
	7300 5500 7300 5600
Connection ~ 7300 5600
Wire Wire Line
	7300 5600 7400 5600
Wire Wire Line
	7400 5600 7750 5600
Wire Wire Line
	7750 5600 7750 5400
Connection ~ 7400 5600
$Comp
L power:+5V #PWR0121
U 1 1 63053F1D
P 7750 5400
F 0 "#PWR0121" H 7750 5250 50  0001 C CNN
F 1 "+5V" H 7765 5573 50  0000 C CNN
F 2 "" H 7750 5400 50  0001 C CNN
F 3 "" H 7750 5400 50  0001 C CNN
	1    7750 5400
	1    0    0    -1  
$EndComp
$Comp
L Device:CP C8
U 1 1 63053F3D
P 9300 4100
F 0 "C8" V 9045 4100 50  0000 C CNN
F 1 "100u" V 9136 4100 50  0000 C CNN
F 2 "Capacitor_THT:CP_Radial_D6.3mm_P2.50mm" H 9338 3950 50  0001 C CNN
F 3 "~" H 9300 4100 50  0001 C CNN
	1    9300 4100
	0    1    1    0   
$EndComp
Connection ~ 9450 4100
Wire Wire Line
	9450 4100 9450 4400
Wire Wire Line
	9450 3800 9450 4100
Wire Wire Line
	9150 4100 9000 4100
Wire Wire Line
	9000 4100 9000 4250
$Comp
L power:GND #PWR0123
U 1 1 63053F48
P 9000 4250
F 0 "#PWR0123" H 9000 4000 50  0001 C CNN
F 1 "GND" H 9005 4077 50  0000 C CNN
F 2 "" H 9000 4250 50  0001 C CNN
F 3 "" H 9000 4250 50  0001 C CNN
	1    9000 4250
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0124
U 1 1 63053F4E
P 9550 5750
F 0 "#PWR0124" H 9550 5500 50  0001 C CNN
F 1 "GND" H 9555 5577 50  0000 C CNN
F 2 "" H 9550 5750 50  0001 C CNN
F 3 "" H 9550 5750 50  0001 C CNN
	1    9550 5750
	1    0    0    -1  
$EndComp
Wire Wire Line
	9550 5750 9550 5600
Wire Wire Line
	9450 5500 9450 5600
Wire Wire Line
	9450 5600 9550 5600
Connection ~ 9550 5600
Wire Wire Line
	9550 5600 9550 5500
$Comp
L Connector_Generic:Conn_01x04 J7
U 1 1 63053F59
P 10100 4000
F 0 "J7" V 10064 3712 50  0000 R CNN
F 1 "Conn_01x04" V 9973 3712 50  0000 R CNN
F 2 "Connector_Molex:Molex_KK-254_AE-6410-04A_1x04_P2.54mm_Vertical" H 10100 4000 50  0001 C CNN
F 3 "~" H 10100 4000 50  0001 C CNN
	1    10100 4000
	0    -1   -1   0   
$EndComp
Wire Wire Line
	10000 4200 10000 4400
Wire Wire Line
	10100 4400 10100 4200
Wire Wire Line
	10200 4200 10200 4400
Wire Wire Line
	10300 4400 10300 4200
Wire Wire Line
	10100 5500 10100 5600
Wire Wire Line
	10100 5600 10200 5600
Wire Wire Line
	10300 5600 10300 5500
Wire Wire Line
	10200 5500 10200 5600
Connection ~ 10200 5600
Wire Wire Line
	10200 5600 10300 5600
Wire Wire Line
	10300 5600 10650 5600
Wire Wire Line
	10650 5600 10650 5400
Connection ~ 10300 5600
$Comp
L power:+5V #PWR0125
U 1 1 63053F72
P 10650 5400
F 0 "#PWR0125" H 10650 5250 50  0001 C CNN
F 1 "+5V" H 10665 5573 50  0000 C CNN
F 2 "" H 10650 5400 50  0001 C CNN
F 3 "" H 10650 5400 50  0001 C CNN
	1    10650 5400
	1    0    0    -1  
$EndComp
Wire Wire Line
	9000 4750 8450 4750
Wire Wire Line
	8450 4750 8450 3400
Wire Wire Line
	8450 2150 9000 2150
Wire Wire Line
	9000 2250 8350 2250
Wire Wire Line
	8350 4850 9000 4850
Wire Wire Line
	9000 2350 8550 2350
Wire Wire Line
	8550 2350 8550 3500
Wire Wire Line
	6950 2900 6950 3000
Wire Wire Line
	6950 3000 7200 3000
Connection ~ 7200 3000
Wire Wire Line
	6950 3000 6850 3000
Wire Wire Line
	6850 3000 6850 2900
Connection ~ 6950 3000
Wire Wire Line
	9750 2900 9750 3000
Wire Wire Line
	9750 3000 9850 3000
Connection ~ 10100 3000
Wire Wire Line
	9850 2900 9850 3000
Connection ~ 9850 3000
Wire Wire Line
	9850 3000 10100 3000
Wire Wire Line
	6850 5500 6850 5600
Wire Wire Line
	6850 5600 6950 5600
Connection ~ 7200 5600
Wire Wire Line
	6950 5500 6950 5600
Connection ~ 6950 5600
Wire Wire Line
	6950 5600 7200 5600
Wire Wire Line
	9750 5500 9750 5600
Wire Wire Line
	9750 5600 9850 5600
Connection ~ 10100 5600
Wire Wire Line
	9850 5500 9850 5600
Connection ~ 9850 5600
Wire Wire Line
	9850 5600 10100 5600
Wire Wire Line
	6100 2350 6000 2350
Wire Wire Line
	6000 2350 6000 3500
Wire Wire Line
	6000 3500 8550 3500
Connection ~ 8550 3500
Wire Wire Line
	8550 3500 8550 4950
NoConn ~ 6100 2450
NoConn ~ 6100 5050
Wire Wire Line
	9000 4950 8550 4950
NoConn ~ 9000 5050
NoConn ~ 9000 2450
Text Label 5250 5400 2    50   Italic 0
ENABLE_Z
Wire Wire Line
	5250 5400 5450 5400
$Comp
L Device:R R2
U 1 1 63119743
P 5450 5150
F 0 "R2" H 5520 5196 50  0000 L CNN
F 1 "10k" H 5520 5105 50  0000 L CNN
F 2 "Resistor_THT:R_Axial_DIN0207_L6.3mm_D2.5mm_P7.62mm_Horizontal" V 5380 5150 50  0001 C CNN
F 3 "~" H 5450 5150 50  0001 C CNN
	1    5450 5150
	1    0    0    -1  
$EndComp
Wire Wire Line
	5450 5300 5450 5400
Wire Wire Line
	5450 5000 5450 4900
$Comp
L power:+5V #PWR0126
U 1 1 63124BBE
P 5450 4900
F 0 "#PWR0126" H 5450 4750 50  0001 C CNN
F 1 "+5V" H 5465 5073 50  0000 C CNN
F 2 "" H 5450 4900 50  0001 C CNN
F 3 "" H 5450 4900 50  0001 C CNN
	1    5450 4900
	1    0    0    -1  
$EndComp
Text Label 6100 4750 2    50   Italic 0
DIR_Z
Text Label 6100 4850 2    50   Italic 0
STEP_Z
Text Label 6100 2250 2    50   Italic 0
STEP_X
Text Label 6100 2150 2    50   Italic 0
DIR_X
$Comp
L Device:R R3
U 1 1 63132285
P 5500 2100
F 0 "R3" H 5570 2146 50  0000 L CNN
F 1 "10k" H 5570 2055 50  0000 L CNN
F 2 "Resistor_THT:R_Axial_DIN0207_L6.3mm_D2.5mm_P7.62mm_Horizontal" V 5430 2100 50  0001 C CNN
F 3 "~" H 5500 2100 50  0001 C CNN
	1    5500 2100
	1    0    0    -1  
$EndComp
Wire Wire Line
	5500 2250 5500 2350
Wire Wire Line
	5500 1950 5500 1850
$Comp
L power:+5V #PWR0127
U 1 1 6313228D
P 5500 1850
F 0 "#PWR0127" H 5500 1700 50  0001 C CNN
F 1 "+5V" H 5515 2023 50  0000 C CNN
F 2 "" H 5500 1850 50  0001 C CNN
F 3 "" H 5500 1850 50  0001 C CNN
	1    5500 1850
	1    0    0    -1  
$EndComp
Wire Wire Line
	5500 2350 6000 2350
Connection ~ 6000 2350
Wire Wire Line
	5500 2350 5300 2350
Connection ~ 5500 2350
Text Label 5300 2350 2    50   Italic 0
ENABLE_XY
Wire Wire Line
	6100 4950 5850 4950
Wire Wire Line
	5850 4950 5850 5400
Wire Wire Line
	5850 5400 5450 5400
Connection ~ 5450 5400
Wire Wire Line
	8450 3400 8050 3400
Wire Wire Line
	8350 3300 8050 3300
Text Label 8050 3300 2    50   Italic 0
STEP_Y
Text Label 8050 3400 2    50   Italic 0
DIR_Y
Connection ~ 8350 3300
Wire Wire Line
	8350 3300 8350 4850
Connection ~ 8450 3400
Wire Wire Line
	8350 2250 8350 3300
Wire Wire Line
	8450 2150 8450 3400
Text Notes 6950 2350 2    50   Italic 0
X
Text Notes 6950 4950 2    50   Italic 0
Z
Text Notes 9850 2350 2    50   Italic 0
Y1
Text Notes 9850 5000 2    50   Italic 0
Y2
Wire Wire Line
	2050 1150 2500 1150
Wire Wire Line
	1650 1150 2050 1150
Connection ~ 2050 1150
$Comp
L power:PWR_FLAG #FLG0101
U 1 1 62FB5914
P 2050 1150
F 0 "#FLG0101" H 2050 1225 50  0001 C CNN
F 1 "PWR_FLAG" H 2050 1323 50  0000 C CNN
F 2 "" H 2050 1150 50  0001 C CNN
F 3 "~" H 2050 1150 50  0001 C CNN
	1    2050 1150
	1    0    0    -1  
$EndComp
Wire Wire Line
	3500 1150 4200 1150
$Comp
L drv8825:DRV8825 U3
U 1 1 631C04A9
P 6850 1700
F 0 "U3" H 7528 1096 50  0000 L CNN
F 1 "DRV8825" H 7528 1005 50  0000 L CNN
F 2 "szopinski-cnc-diploma:DIP-16_W15.24mm" H 7550 1100 50  0001 C CNN
F 3 "" H 7550 1100 50  0001 C CNN
	1    6850 1700
	1    0    0    -1  
$EndComp
$Comp
L drv8825:DRV8825 U5
U 1 1 631C0D6D
P 9750 1700
F 0 "U5" H 10428 1096 50  0000 L CNN
F 1 "DRV8825" H 10428 1005 50  0000 L CNN
F 2 "szopinski-cnc-diploma:DIP-16_W15.24mm" H 10450 1100 50  0001 C CNN
F 3 "" H 10450 1100 50  0001 C CNN
	1    9750 1700
	1    0    0    -1  
$EndComp
$Comp
L drv8825:DRV8825 U4
U 1 1 631C1F07
P 6850 4300
F 0 "U4" H 7528 3696 50  0000 L CNN
F 1 "DRV8825" H 7528 3605 50  0000 L CNN
F 2 "szopinski-cnc-diploma:DIP-16_W15.24mm" H 7550 3700 50  0001 C CNN
F 3 "" H 7550 3700 50  0001 C CNN
	1    6850 4300
	1    0    0    -1  
$EndComp
$Comp
L drv8825:DRV8825 U6
U 1 1 631C2F6C
P 9750 4300
F 0 "U6" H 10428 3696 50  0000 L CNN
F 1 "DRV8825" H 10428 3605 50  0000 L CNN
F 2 "szopinski-cnc-diploma:DIP-16_W15.24mm" H 10450 3700 50  0001 C CNN
F 3 "" H 10450 3700 50  0001 C CNN
	1    9750 4300
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR0101
U 1 1 62FEF948
P 2500 950
F 0 "#PWR0101" H 2500 800 50  0001 C CNN
F 1 "+12V" H 2515 1123 50  0000 C CNN
F 2 "" H 2500 950 50  0001 C CNN
F 3 "" H 2500 950 50  0001 C CNN
	1    2500 950 
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR0108
U 1 1 62FF0287
P 6550 1200
F 0 "#PWR0108" H 6550 1050 50  0001 C CNN
F 1 "+12V" H 6565 1373 50  0000 C CNN
F 2 "" H 6550 1200 50  0001 C CNN
F 3 "" H 6550 1200 50  0001 C CNN
	1    6550 1200
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR0114
U 1 1 62FF0BDD
P 9450 1200
F 0 "#PWR0114" H 9450 1050 50  0001 C CNN
F 1 "+12V" H 9465 1373 50  0000 C CNN
F 2 "" H 9450 1200 50  0001 C CNN
F 3 "" H 9450 1200 50  0001 C CNN
	1    9450 1200
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR0118
U 1 1 62FF0F2C
P 9450 3800
F 0 "#PWR0118" H 9450 3650 50  0001 C CNN
F 1 "+12V" H 9465 3973 50  0000 C CNN
F 2 "" H 9450 3800 50  0001 C CNN
F 3 "" H 9450 3800 50  0001 C CNN
	1    9450 3800
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR0122
U 1 1 62FF1485
P 6550 3800
F 0 "#PWR0122" H 6550 3650 50  0001 C CNN
F 1 "+12V" H 6565 3973 50  0000 C CNN
F 2 "" H 6550 3800 50  0001 C CNN
F 3 "" H 6550 3800 50  0001 C CNN
	1    6550 3800
	1    0    0    -1  
$EndComp
$Comp
L Device:C C3
U 1 1 62FBB303
P 3450 5050
F 0 "C3" H 3565 5096 50  0000 L CNN
F 1 "22p" H 3565 5005 50  0000 L CNN
F 2 "Capacitor_THT:C_Disc_D6.0mm_W4.4mm_P5.00mm" H 3488 4900 50  0001 C CNN
F 3 "~" H 3450 5050 50  0001 C CNN
	1    3450 5050
	1    0    0    -1  
$EndComp
$Comp
L Device:Crystal Y1
U 1 1 62FBE1B3
P 3700 4750
F 0 "Y1" H 3700 5018 50  0000 C CNN
F 1 "20 MHz" H 3700 4927 50  0000 C CNN
F 2 "Crystal:Crystal_HC49-4H_Vertical" H 3700 4750 50  0001 C CNN
F 3 "~" H 3700 4750 50  0001 C CNN
	1    3700 4750
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0106
U 1 1 62FC0F7D
P 3450 5200
F 0 "#PWR0106" H 3450 4950 50  0001 C CNN
F 1 "GND" H 3455 5027 50  0000 C CNN
F 2 "" H 3450 5200 50  0001 C CNN
F 3 "" H 3450 5200 50  0001 C CNN
	1    3450 5200
	1    0    0    -1  
$EndComp
Wire Wire Line
	3450 4500 3450 4750
Wire Wire Line
	3550 4750 3450 4750
Connection ~ 3450 4750
Wire Wire Line
	3450 4750 3450 4900
Text Label 3600 3900 2    50   ~ 0
RESET
Text Label 2950 5300 0    50   ~ 0
RESET
$Comp
L Device:R R1
U 1 1 62FE1616
P 2750 5050
F 0 "R1" H 2820 5096 50  0000 L CNN
F 1 "10k" H 2820 5005 50  0000 L CNN
F 2 "Resistor_THT:R_Axial_DIN0207_L6.3mm_D2.5mm_P7.62mm_Horizontal" V 2680 5050 50  0001 C CNN
F 3 "~" H 2750 5050 50  0001 C CNN
	1    2750 5050
	1    0    0    -1  
$EndComp
Wire Wire Line
	2750 5300 2950 5300
$Comp
L power:+5V #PWR0107
U 1 1 62FE1DF1
P 2750 4800
F 0 "#PWR0107" H 2750 4650 50  0001 C CNN
F 1 "+5V" H 2765 4973 50  0000 C CNN
F 2 "" H 2750 4800 50  0001 C CNN
F 3 "" H 2750 4800 50  0001 C CNN
	1    2750 4800
	1    0    0    -1  
$EndComp
Wire Wire Line
	2750 5200 2750 5300
Wire Wire Line
	2750 4900 2750 4800
NoConn ~ 4100 3300
$Comp
L power:GND #PWR0109
U 1 1 62FD4A00
P 4100 4200
F 0 "#PWR0109" H 4100 3950 50  0001 C CNN
F 1 "GND" H 4105 4027 50  0000 C CNN
F 2 "" H 4100 4200 50  0001 C CNN
F 3 "" H 4100 4200 50  0001 C CNN
	1    4100 4200
	1    0    0    -1  
$EndComp
$Comp
L Connector:AVR-ISP-10 J3
U 1 1 62FCAE29
P 4000 3800
F 0 "J3" H 3670 3896 50  0000 R CNN
F 1 "AVR-ISP-10" H 3670 3805 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_2x05_P2.54mm_Vertical" V 3750 3850 50  0001 C CNN
F 3 " ~" H 2725 3250 50  0001 C CNN
	1    4000 3800
	-1   0    0    -1  
$EndComp
Wire Wire Line
	3950 4750 3950 4900
Wire Wire Line
	3850 4750 3950 4750
Connection ~ 3950 4750
Wire Wire Line
	3950 4400 3950 4750
$Comp
L power:GND #PWR0110
U 1 1 62FC13E2
P 3950 5200
F 0 "#PWR0110" H 3950 4950 50  0001 C CNN
F 1 "GND" H 3955 5027 50  0000 C CNN
F 2 "" H 3950 5200 50  0001 C CNN
F 3 "" H 3950 5200 50  0001 C CNN
	1    3950 5200
	1    0    0    -1  
$EndComp
$Comp
L Device:C C4
U 1 1 62FBBC52
P 3950 5050
F 0 "C4" H 4065 5096 50  0000 L CNN
F 1 "22p" H 4065 5005 50  0000 L CNN
F 2 "Capacitor_THT:C_Disc_D6.0mm_W4.4mm_P5.00mm" H 3988 4900 50  0001 C CNN
F 3 "~" H 3950 5050 50  0001 C CNN
	1    3950 5050
	1    0    0    -1  
$EndComp
Wire Wire Line
	2300 4100 2700 3700
Wire Wire Line
	2300 4200 2900 3600
Wire Wire Line
	2300 4300 2800 3800
Wire Wire Line
	2800 3800 3600 3800
Wire Wire Line
	3600 3700 2700 3700
Wire Wire Line
	2900 3600 3600 3600
NoConn ~ 2100 3800
Wire Wire Line
	1500 2800 1500 3100
Wire Wire Line
	1500 3100 1500 3500
Connection ~ 1500 3100
Wire Wire Line
	950  3100 1050 3100
Wire Wire Line
	1350 3100 1500 3100
Wire Wire Line
	950  3100 950  3300
$Comp
L Device:C C9
U 1 1 632C6F4E
P 1200 3100
F 0 "C9" V 948 3100 50  0000 C CNN
F 1 "100n" V 1039 3100 50  0000 C CNN
F 2 "Capacitor_THT:C_Disc_D6.0mm_W4.4mm_P5.00mm" H 1238 2950 50  0001 C CNN
F 3 "~" H 1200 3100 50  0001 C CNN
	1    1200 3100
	0    1    1    0   
$EndComp
Text Label 2100 5600 0    50   Italic 0
TXD
Text Label 2100 5500 0    50   Italic 0
RXD
$Comp
L power:GND #PWR01
U 1 1 63307F73
P 950 3300
F 0 "#PWR01" H 950 3050 50  0001 C CNN
F 1 "GND" H 955 3127 50  0000 C CNN
F 2 "" H 950 3300 50  0001 C CNN
F 3 "" H 950 3300 50  0001 C CNN
	1    950  3300
	1    0    0    -1  
$EndComp
Wire Wire Line
	1600 3000 1600 3500
$Comp
L power:+5V #PWR02
U 1 1 632C6D7C
P 1600 3000
F 0 "#PWR02" H 1600 2850 50  0001 C CNN
F 1 "+5V" H 1615 3173 50  0000 C CNN
F 2 "" H 1600 3000 50  0001 C CNN
F 3 "" H 1600 3000 50  0001 C CNN
	1    1600 3000
	1    0    0    -1  
$EndComp
Wire Wire Line
	2300 4100 2100 4100
Wire Wire Line
	2100 4200 2300 4200
Wire Wire Line
	2300 4300 2100 4300
Text Label 2100 5700 0    50   Italic 0
ENABLE_XY
Text Label 2100 3900 0    50   Italic 0
ENABLE_Z
NoConn ~ 2100 6100
$Comp
L MCU_Microchip_ATmega:ATmega328P-PU U1
U 1 1 62FA789B
P 1500 5000
F 0 "U1" H 1400 5050 50  0000 R CNN
F 1 "ATmega328P-PU" H 1700 4950 50  0000 R CNN
F 2 "Package_DIP:DIP-28_W7.62mm" H 1500 5000 50  0001 C CIN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega328_P%20AVR%20MCU%20with%20picoPower%20Technology%20Data%20Sheet%2040001984A.pdf" H 1500 5000 50  0001 C CNN
	1    1500 5000
	1    0    0    -1  
$EndComp
NoConn ~ 2100 4000
NoConn ~ 2100 6000
NoConn ~ 2100 5900
NoConn ~ 2100 5800
NoConn ~ 2100 6200
Text Label 2100 4700 0    50   Italic 0
STEP_Z
Text Label 2100 4800 0    50   Italic 0
DIR_Z
Text Label 2100 4900 0    50   Italic 0
STEP_X
Text Label 2100 5000 0    50   Italic 0
DIR_X
Text Label 2100 5100 0    50   Italic 0
STEP_Y
Text Label 2100 5200 0    50   Italic 0
DIR_Y
Wire Wire Line
	2100 4400 3950 4400
Wire Wire Line
	2100 5300 2750 5300
Wire Wire Line
	2100 4500 3450 4500
Wire Wire Line
	1500 6700 1500 6500
$Comp
L power:GND #PWR0105
U 1 1 62FB9202
P 1500 6700
F 0 "#PWR0105" H 1500 6450 50  0001 C CNN
F 1 "GND" H 1505 6527 50  0000 C CNN
F 2 "" H 1500 6700 50  0001 C CNN
F 3 "" H 1500 6700 50  0001 C CNN
	1    1500 6700
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0103
U 1 1 62FB8050
P 1500 2800
F 0 "#PWR0103" H 1500 2650 50  0001 C CNN
F 1 "+5V" H 1515 2973 50  0000 C CNN
F 2 "" H 1500 2800 50  0001 C CNN
F 3 "" H 1500 2800 50  0001 C CNN
	1    1500 2800
	1    0    0    -1  
$EndComp
NoConn ~ 900  3800
Connection ~ 2750 5300
$Comp
L Connector_Generic:Conn_02x08_Odd_Even J2
U 1 1 63181ED5
P 3950 6700
F 0 "J2" H 4000 7217 50  0000 C CNN
F 1 "Conn_02x08_Odd_Even" H 4000 7126 50  0000 C CNN
F 2 "Connector_PinSocket_2.54mm:PinSocket_2x08_P2.54mm_Vertical" H 3950 6700 50  0001 C CNN
F 3 "~" H 3950 6700 50  0001 C CNN
	1    3950 6700
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0128
U 1 1 631A455B
P 4500 6150
F 0 "#PWR0128" H 4500 6000 50  0001 C CNN
F 1 "+5V" H 4515 6323 50  0000 C CNN
F 2 "" H 4500 6150 50  0001 C CNN
F 3 "" H 4500 6150 50  0001 C CNN
	1    4500 6150
	1    0    0    -1  
$EndComp
Wire Wire Line
	4500 6150 4500 6400
Wire Wire Line
	4250 6400 4500 6400
$Comp
L power:GND #PWR0129
U 1 1 631AB985
P 3500 7350
F 0 "#PWR0129" H 3500 7100 50  0001 C CNN
F 1 "GND" H 3505 7177 50  0000 C CNN
F 2 "" H 3500 7350 50  0001 C CNN
F 3 "" H 3500 7350 50  0001 C CNN
	1    3500 7350
	1    0    0    -1  
$EndComp
Wire Wire Line
	3500 7100 3750 7100
Wire Wire Line
	3500 7100 3500 7350
NoConn ~ 4250 6500
NoConn ~ 4250 6600
NoConn ~ 4250 6700
NoConn ~ 3750 6500
NoConn ~ 3750 6600
NoConn ~ 3750 6700
NoConn ~ 3750 7000
NoConn ~ 4250 7000
NoConn ~ 3750 6400
Text Label 3750 6800 2    50   ~ 0
TXD
Text Label 3750 6900 2    50   ~ 0
RXD
NoConn ~ 4250 6800
NoConn ~ 4250 6900
NoConn ~ 4250 7100
Wire Bus Line
	1000 650  4600 650 
Wire Bus Line
	4600 650  4600 2350
Wire Bus Line
	4600 2350 1000 2350
Wire Bus Line
	1000 650  1000 2350
Text Notes 1100 2300 0    100  ~ 0
Power supply
Wire Bus Line
	3300 5600 4250 5600
Wire Bus Line
	4250 5600 4250 4650
Wire Bus Line
	4250 4650 3850 4250
Wire Bus Line
	3850 4250 2950 4250
Wire Bus Line
	2950 4250 2150 3450
Wire Bus Line
	2150 2550 800  2550
Text Notes 850  7050 0    100  ~ 0
Microcontroller
Wire Bus Line
	3300 5600 2050 7100
Wire Bus Line
	2050 7100 800  7100
Wire Bus Line
	4850 6050 11050 6050
Wire Bus Line
	11050 6050 11050 750 
Wire Bus Line
	11050 750  4850 750 
Wire Bus Line
	4850 750  4850 6050
Text Notes 4900 6000 0    100  ~ 0
Stepper motor drivers
Text Notes 3550 3200 0    50   ~ 0
In-system programming
Text Notes 4400 6850 0    50   ~ 0
Serial interface\n(FT232R breakout board)
Wire Bus Line
	2150 2550 2150 3450
Wire Bus Line
	800  2550 800  7100
$EndSCHEMATC

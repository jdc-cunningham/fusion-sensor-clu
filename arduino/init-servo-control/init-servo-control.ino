
// The I2C part of this code is based on this tutorial:
// https://dronebotworkshop.com/i2c-arduino-raspberry-pi/
// laughably struggled with simple string split
// https://forum.arduino.cc/index.php?topic=155667.0

#include <Wire.h>
#include <Servo.h>

Servo tiltServo;
Servo panServo;

int panServoPos = 94;
int panMaxRange = 30;
int tiltServoPos = 89;
int tiltMaxRange = 30;

String mainCmd = "";
String secondParam = "";
String secondCmd = "";
String thirdCmd = "";
String fourthCmd = "";

bool isCmdProcessing = false;
bool isFullSweepCmd = false;
bool isFullSweepLoopProcessing = false;

// build out variables for full sweep
// this sucks but can't seem to just split the assembled string/char group from i2c
String fsPanMinRange = "";
String fsPanMaxRange = "";
String fsTiltMinRange = "";
String fsTiltMaxRange = "";
String fsIncrement = "";
String fsDelay = "";

void setup() {
  Serial.begin(9600);
  Wire.begin(0x8);
  Wire.onReceive(receiveEvent);
  panServo.attach(2);
  tiltServo.attach(3);
  panServo.write(panServoPos);
  tiltServo.write(tiltServoPos);
}

// makes sure max range not exceeded
void servoWrite(String servo, int pos) {
  if (servo == "pan") {
    if (pos <= (panServoPos + panMaxRange) || pos >= (panServoPos - panMaxRange)) {
      panServo.write(pos);
    }
  } else {
    if (pos <= (tiltServoPos + tiltMaxRange) || pos >= (tiltServoPos - tiltMaxRange)) {
      tiltServo.write(pos);
    }
  }

  isCmdProcessing = false;
}

// delayMs set to 0 due to base delay of 1s per servo motion
void sweep(String servo, int increment = 2, int delayMs = 1000, int min = 0, int max = 0) { // min max normally not passed in
  bool isPanServo = servo == "pan";
  int sweepMin = isPanServo ? (panServoPos - panMaxRange) : (tiltServoPos - tiltMaxRange); // 30 is a coincidence
  int sweepMax = isPanServo ? (panServoPos + panMaxRange) : (tiltServoPos + tiltMaxRange);

  if (min && max) {
    sweepMin = isPanServo ? (panServoPos - max) : (tiltServoPos - max);
    sweepMax = isPanServo ? (panServoPos + max) : (tiltServoPos + max);
  }

  // sign seems to be stripped
  for (int i = sweepMin; i <= sweepMax; i = i + increment) {
    isCmdProcessing = true;

    servoWrite(servo, i);

    if (i > sweepMax) {
      servoWrite(servo, i);
    }

    // timeLoop(millis(), delayMs);
    delay(delayMs);
  }

  isCmdProcessing = false;
}

// these do need better names, not just incremental commands
void resetI2cVariables() {
  mainCmd = "";
  secondParam = "";
  secondCmd = "";
  thirdCmd = "";
  fourthCmd = "";
  isFullSweepCmd = false;
  fsPanMinRange = "";
  fsPanMaxRange = "";
  fsTiltMinRange = "";
  fsTiltMaxRange = "";
  fsIncrement = "";
  fsDelay = "";
}

void receiveEvent(int bytes) {
  Serial.println("receive");
  if (isCmdProcessing || isFullSweepLoopProcessing) {
    return;
  }

  int loopCounter = 0;
  resetI2cVariables();

  // the reason these values are split is because
  // if I just join them into one big string, try to parse/access by array
  // the values aren't correct
  while (Wire.available()) {
    char c = Wire.read();

    if (loopCounter == 1) {
      mainCmd = c;
    }

    if (loopCounter == 2) {
      secondParam = c;

      if (mainCmd == "s" && secondParam == "_") {
        isFullSweepCmd = true;
      }
    }


    if (isFullSweepCmd) {
      // get extra params from cmd ex. s_p-020, 020_t-010, 030_1000
      if (loopCounter > 3 && loopCounter < 8) {
        fsPanMinRange += c;
      }

      if (loopCounter > 8 && loopCounter < 12) {
        fsPanMaxRange += c;
      }

      if (loopCounter > 13 && loopCounter < 18) {
        fsTiltMinRange += c;
      }

      if (loopCounter > 18 && loopCounter < 22) {
        fsTiltMaxRange += c;
      }

      if (loopCounter > 23 && loopCounter < 27) {
        fsIncrement += c;
      }

      if (loopCounter > 27) {
        fsDelay += c;
      }
    } else {
      if (loopCounter > 1 and loopCounter < 5) { // eg. p179 or t179
        secondCmd += c; // 001 for increment 1
      }

      if (loopCounter == 5) { // eg. s179t || s179p
        thirdCmd = c;
      }

      if (loopCounter > 5 && loopCounter <= 9) { // eg. s179t1000... what about 0.5 or 10000 (10 seconds)
        fourthCmd += c;
      }
    }

    loopCounter++;
  }
}

void fullSweep() {
  // sample cmd: s_p-010,010_t-010,010_i010_500
  // means p range is -10 to 10 deg, tilt is -10 to 10 deg, increment is 10 meaning -10, 0, 10 and servo delay is 500
  int fsIncrementInt = fsIncrement.toInt();

  for (int i = fsTiltMinRange.toInt(); i <= fsTiltMaxRange.toInt(); i = i + fsIncrementInt) {
    servoWrite("tilt", tiltServoPos + i);
    delay(fsIncrementInt);
    sweep("pan", fsIncrement.toInt(), fsDelay.toInt(), fsPanMinRange.toInt(), fsPanMaxRange.toInt()); // ehh all this type conversion
    delay(fsIncrementInt);
    // could watch current draw on servo to see when it stops moving(drop)
  }
}

void recenterServos() {
  isCmdProcessing = true;
  servoWrite("pan", panServoPos);
  isCmdProcessing = true;
  servoWrite("tilt", tiltServoPos);
}

void loop() {
  // this is all ugly but still in prototype stage
  if (mainCmd == "p") {
    isCmdProcessing = true;
    servoWrite("pan", secondCmd.toInt());
    delay(1000); // no position feedback
  }
  
  if (mainCmd == "t") {
    isCmdProcessing = true;
    servoWrite("tilt", secondCmd.toInt());
    delay(1000); // no position feedback
  }

  if (mainCmd == "s") {
    if (secondParam != "") { // wait till determine what command
      if (isFullSweepCmd) {
        isFullSweepLoopProcessing = true;
        fullSweep();
        recenterServos();
        isFullSweepLoopProcessing = false;
      } else {
        if (thirdCmd == "p") {
          sweep("pan", secondCmd.toInt(), fourthCmd.toInt());
        } else {
          sweep("tilt", secondCmd.toInt(), fourthCmd.toInt());
        }
        recenterServos();
      }
    }
  }

  if (!isCmdProcessing && !isFullSweepLoopProcessing) {
    resetI2cVariables();
  }

  delay(100);
}

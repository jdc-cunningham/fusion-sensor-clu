#include <Servo.h>

bool called = false;
Servo tiltServo;

int tiltServoPos = 89;
int tiltMaxRange = 30;

void setup() {
  Serial.begin(9600);
  tiltServo.attach(3);
}

void servoWrite(int pos) {
    Serial.println("servo write call");
    tiltServo.write(pos);
}

void sweepLoop() {
    for (int i = 74; i <= 134; i++) {
        Serial.print("loop run");
        servoWrite(i);
        delay(1000);
    }
}

void loop() {
    Serial.println("loop run");

    if (!called) {
        called = true;
        sweepLoop();
    }

    delay(100);
}
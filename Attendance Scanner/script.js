// ========================================
// EMAILJS SETTINGS
// ========================================

const EMAILJS_PUBLIC_KEY = "CAzSmuFdHKBG5pBIA";
const EMAILJS_SERVICE_ID = "Chanoguinto123";
const EMAILJS_TEMPLATE_ID = "template_vwiqj76";


// ========================================
// INITIALIZE EMAILJS
// ========================================

emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});


// ========================================
// STUDENT DATABASE
// ========================================

const students = {

    // STUDENT 1 - ARNOLD
    "2026-03051-MN-0": {
        name: "Arnold Christian S Guinto",
        section: "BS Computer Engineering",
        email: "arnoldchristianguinto53@gmail.com"
    },

    // STUDENT 2 - JETHRO
    "136484110163": {
        name: "Jethro Mandi",
        section: "Electronic Communication Engineering Technology",
        email: "mandijethro26@gmail.com"
    }

};


// ========================================
// HTML ELEMENTS
// ========================================

const result = document.getElementById("result");
const studentInfo = document.getElementById("studentInfo");

let lastScannedID = "";


// ========================================
// QR SCAN SUCCESS
// ========================================

function onScanSuccess(decodedText) {

    // Remove spaces and line breaks
    const studentID = decodedText.trim();

    console.log("Scanned student ID:", studentID);

    // Prevent duplicate scanning
    if (studentID === lastScannedID) {
        return;
    }

    lastScannedID = studentID;


    // Find student using student number
    const student = students[studentID];


    // ========================================
    // STUDENT FOUND
    // ========================================

    if (student) {

        const now = new Date();

        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();


        result.innerHTML = "✅ Attendance Recorded";
        result.style.backgroundColor = "#dff7e3";


        studentInfo.style.display = "block";

        studentInfo.innerHTML = `

            <h2>Student Information</h2>

            <p>
                <strong>Name:</strong>
                ${student.name}
            </p>

            <p>
                <strong>Student ID:</strong>
                ${studentID}
            </p>

            <p>
                <strong>Program:</strong>
                ${student.section}
            </p>

            <p>
                <strong>Date:</strong>
                ${date}
            </p>

            <p>
                <strong>Time:</strong>
                ${time}
            </p>

            <p id="emailStatus">
                📧 Sending attendance email...
            </p>

        `;


        // Send attendance email
        sendAttendanceEmail(
            student,
            studentID,
            date,
            time
        );


    } else {

        // ========================================
        // STUDENT NOT REGISTERED
        // ========================================

        result.innerHTML =
            "❌ Student ID not registered.";

        result.style.backgroundColor =
            "#ffe1e1";


        studentInfo.style.display = "block";

        studentInfo.innerHTML = `

            <h2>Student Not Registered</h2>

            <p>
                <strong>Scanned ID:</strong>
                ${studentID}
            </p>

            <p>
                Please check the QR code.
            </p>

        `;

        console.log(
            "Student ID not registered:",
            studentID
        );
    }


    // ========================================
    // RESET AFTER 5 SECONDS
    // ========================================

    setTimeout(() => {

        lastScannedID = "";

        result.innerHTML =
            "Ready for next scan...";

        result.style.backgroundColor =
            "#f1f1f1";

    }, 5000);
}


// ========================================
// SEND ATTENDANCE EMAIL
// ========================================

function sendAttendanceEmail(
    student,
    studentID,
    date,
    time
) {

    const templateParams = {

        // Send to the student's email
        to_email: student.email,

        student_name: student.name,

        student_id: studentID,

        program: student.section,

        attendance_date: date,

        attendance_time: time

    };


    console.log(
        "Sending email to:",
        student.email
    );


    emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
    )

    .then(function(response) {

        console.log(
            "EMAIL SENT:",
            response.status,
            response.text
        );


        const emailStatus =
            document.getElementById("emailStatus");

        if (emailStatus) {

            emailStatus.innerHTML =
                "📧 Attendance email sent successfully!";

        }

    })

    .catch(function(error) {

        console.error(
            "EMAIL ERROR:",
            error
        );

        console.error(
            "ERROR TEXT:",
            error.text
        );

        console.error(
            "ERROR STATUS:",
            error.status
        );


        const emailStatus =
            document.getElementById("emailStatus");

        if (emailStatus) {

            emailStatus.innerHTML =
                "⚠️ Email failed: " +
                (
                    error.text ||
                    error.message ||
                    "Unknown EmailJS error"
                );

        }

    });
}


// ========================================
// QR SCANNER FAILURE
// ========================================

function onScanFailure(error) {

    // Scanner keeps looking for a QR code.
}


// ========================================
// START QR SCANNER
// ========================================

const scanner = new Html5QrcodeScanner(

    "reader",

    {
        fps: 10,

        qrbox: {
            width: 250,
            height: 250
        }
    },

    false
);


scanner.render(
    onScanSuccess,
    onScanFailure
);
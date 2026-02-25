const config = {
	primary_color: "#1a4d2e",
	sound_enabled: true,
	refresh_rate: 10000,
	departments: [
		"Cardiology",
		"Pediatrics",
		"Orthopedics",
		"Dermatology",
		"Neurology",
		"General Practice"
	],
	conditions: [
		"Hypertension",
		"Viral Infection",
		"Migraine",
		"Routine Checkup",
		"Sprained Ankle",
		"Flu Symptoms",
		"Diabetes Check",
		"Allergy Testing",
		"Physical Exam",
		"Vaccination"
	],
	actions: [
		"Prescribe Rest",
		"Blood Test",
		"MRI Scan",
		"Follow-up in 2 weeks",
		"Physical Therapy",
		"Prescribe Antibiotics",
		"Medication Review",
		"Diet Plan",
		"Lab Work",
		"Specialist Referral"
	]
};

const sounds = {
	ding: new Audio(
		"https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3"
	),
	notification: new Audio(
		"https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"
	),
	page_turn: new Audio(
		"https://assets.mixkit.co/sfx/preview/mixkit-page-turn-swipe-1492.mp3"
	),
	success: new Audio(
		"https://assets.mixkit.co/sfx/preview/mixkit-success-bell-593.mp3"
	)
};

Object.values(sounds).forEach((sound) => {
	sound.load();
});

const first_names = [
	"James",
	"Mary",
	"Robert",
	"Patricia",
	"John",
	"Jennifer",
	"Michael",
	"Linda",
	"David",
	"Elizabeth",
	"Dean",
	"Martha",
	"Sarah",
	"William",
	"Emma",
	"Daniel"
];
const last_names = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Garcia",
	"Miller",
	"Davis",
	"Rodriguez",
	"Martinez",
	"Ferrera",
	"Walsh",
	"Chen",
	"Taylor",
	"Anderson",
	"Thomas"
];

let current_patient_index = 0;
let patients = [];
let current_date = new Date();
let current_month = current_date.getMonth();
let current_year = current_date.getFullYear();
let appointments = [];
let is_speaking = false;
let voices = [];

const doctor_view = document.getElementById("doctor-view");
const patient_view = document.getElementById("patient-view");
const doctor_view_btn = document.getElementById("doctor-view-btn");
const patient_view_btn = document.getElementById("patient-view-btn");
const sound_toggle = document.getElementById("sound-toggle");
const notification = document.getElementById("notification");
const notification_text = document.getElementById("notification-text");
const next_patient_btn = document.getElementById("next-patient-btn");
const next_patient_btn_2 = document.getElementById("next-patient-btn-2");
const prev_patient_btn = document.getElementById("prev-patient-btn");
const current_patient_name = document.getElementById("current-patient-name");
const current_patient_turn = document.getElementById("current-patient-turn");
const current_patient_avatar = document.getElementById(
	"current-patient-avatar"
);
const current_patient_age = document.getElementById("current-patient-age");
const current_patient_condition = document.getElementById(
	"current-patient-condition"
);
const current_turn_display = document.getElementById("current-turn-display");
const patient_queue = document.getElementById("patient-queue");
const queue_count = document.getElementById("queue-count");
const total_patients = document.getElementById("total-patients");
const completed_patients = document.getElementById("completed-patients");
const waiting_patients = document.getElementById("waiting-patients");
const avg_time = document.getElementById("avg-time");
const progress_fill = document.getElementById("progress-fill");
const calendar_days = document.getElementById("calendar-days");
const prev_month_btn = document.getElementById("prev-month");
const next_month_btn = document.getElementById("next-month");
const patient_turn_display = document.getElementById("patient-turn-display");
const patient_name = document.getElementById("patient-name");
const patient_room = document.getElementById("patient-room");
const current_date_element = document.getElementById("current-date");
const view_title = document.getElementById("view-title");
const view_containers = document.querySelectorAll(".view-container");
const nav_items = document.querySelectorAll(".nav-item");
const hamburger_btn = document.getElementById("hamburger-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const patient_screen_prev = document.getElementById("patient-screen-prev");
const patient_screen_next = document.getElementById("patient-screen-next");
const info_modal = document.getElementById("info-modal");
const close_info_btn = document.getElementById("close-info-btn");

const intro_btn = document.getElementById("intro-btn");
const theory_btn = document.getElementById("theory-btn");
const about_btn = document.getElementById("about-btn");

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTurn(prefix = null) {
	const letters = ["A", "B", "C", "D", "E"];
	const prefix_letter = prefix || letters[getRandomInt(0, 4)];
	return `${prefix_letter}-${getRandomInt(100, 999)}`;
}

function generatePatient(index, current = false) {
	const first_name = first_names[getRandomInt(0, first_names.length - 1)];
	const last_name = last_names[getRandomInt(0, last_names.length - 1)];
	const age = getRandomInt(18, 85);
	const gender = ["Male", "Female", "Other"][getRandomInt(0, 2)];

	return {
		id: index,
		turn: generateTurn(),
		name: `${first_name} ${last_name}`,
		initials: `${first_name[0]}${last_name[0]}`,
		age: age,
		gender: gender,
		room: getRandomInt(100, 120),
		floor: getRandomInt(1, 3),
		time: `${getRandomInt(8, 16)}:${getRandomInt(0, 5)}0`,
		department:
			config.departments[getRandomInt(0, config.departments.length - 1)],
		condition: config.conditions[getRandomInt(0, config.conditions.length - 1)],
		action: config.actions[getRandomInt(0, config.actions.length - 1)],
		status: current ? "In Progress" : "Waiting",
		arrival_time: new Date(Date.now() - getRandomInt(5, 60) * 60000)
	};
}

function generatePatientHistory(patient_id) {
	const history = [];
	const history_count = getRandomInt(1, 5);

	for (let i = 0; i < history_count; i++) {
		const date = new Date();
		date.setMonth(date.getMonth() - getRandomInt(1, 12));
		history.push({
			id: `${patient_id}-${i}`,
			date: date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric"
			}),
			diagnosis: config.conditions[getRandomInt(0, config.conditions.length - 1)],
			doctor: `Dr. ${last_names[getRandomInt(0, last_names.length - 1)]}`,
			notes: getRandomInt(0, 1)
				? "Follow-up required"
				: "Treatment completed successfully"
		});
	}
	return history;
}

function generateAppointments() {
	const appointments_list = [];
	const appointment_count = getRandomInt(5, 10);

	for (let i = 0; i < appointment_count; i++) {
		const hour = getRandomInt(8, 16);
		const minute = getRandomInt(0, 11) * 5;
		const first_name = first_names[getRandomInt(0, first_names.length - 1)];
		const last_name = last_names[getRandomInt(0, last_names.length - 1)];

		appointments_list.push({
			id: i,
			time: `${hour}:${minute.toString().padStart(2, "0")}`,
			patient: `${first_name} ${last_name}`,
			type: ["Checkup", "Follow-up", "Consultation", "Procedure"][
				getRandomInt(0, 3)
			],
			doctor: `Dr. ${last_names[getRandomInt(0, last_names.length - 1)]}`
		});
	}

	return appointments_list.sort((a, b) => {
		const time_a = a.time.split(":").map(Number);
		const time_b = b.time.split(":").map(Number);
		return time_a[0] * 60 + time_a[1] - (time_b[0] * 60 + time_b[1]);
	});
}

function shareTwitter() {
	const shareUrl = "https://julibe.com/";
	const viaUser = "Julibe";

	const messages = [
		"Experience the future of hospital management with DoCare! #HealthTech #UIUX",
		"Streamlining patient care one click at a time. Check out my latest project, DoCare. #WebDesign",
		"Digital health records made beautiful and efficient. This is DoCare. #FrontendDev",
		"Just built a comprehensive Hospital Management System concept. Efficiency meets design! #Julibe",
		"Transforming complex medical data into intuitive interfaces. #DoCare #UXDesign"
	];

	const hashtagsList = [
		"HealthTech",
		"UIUX",
		"WebDesign",
		"Frontend",
		"MedicalApp",
		"Dashboard",
		"Julibe",
		"DesignInspiration",
		"Coding",
		"DigitalHealth"
	];

	const text = messages[Math.floor(Math.random() * messages.length)];

	let selectedTags = hashtagsList
		.sort(() => 0.5 - Math.random())
		.slice(0, 4)
		.map((tag) => tag.replace(/\s+/g, ""));

	const urlLength = 23;
	const viaLength = 6 + viaUser.length;
	const maxChars = 280;

	while (selectedTags.length > 0) {
		const tagsLength = selectedTags.reduce((acc, tag) => acc + tag.length + 2, 0);
		const totalLength = text.length + urlLength + viaLength + tagsLength;

		if (totalLength <= maxChars) break;
		selectedTags.pop();
	}

	const hashtags = selectedTags.join(",");

	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		text
	)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(
		hashtags
	)}&via=${encodeURIComponent(viaUser)}`;

	window.open(twitterUrl, "_blank");
}

function initApp() {
	patients = [];
	for (let i = 0; i < 8; i++) {
		patients.push(generatePatient(i, i === 0));
	}

	appointments = generateAppointments();
	updateCurrentDate();
	updateDoctorView();
	updatePatientView();
	updateQueue();
	updateStats();
	updateCalendar();
	updateAppointments();
	updatePatientList();
	setupEventListeners();
	setupKeyboardNavigation();

	setInterval(() => {
		if (Math.random() > 0.7 && patients.length < 15) {
			addNewPatient();
		}
		updateQueue();
		updateStats();
	}, config.refresh_rate);

	loadVoices();
	if (window.speechSynthesis) {
		window.speechSynthesis.onvoiceschanged = loadVoices;
	}
}

function loadVoices() {
	if (window.speechSynthesis) {
		voices = window.speechSynthesis.getVoices();
	}
}

function switchView(view_id) {
	view_containers.forEach((container) => {
		container.classList.remove("active");
	});

	const active_view = document.getElementById(view_id);
	if (active_view) {
		active_view.classList.add("active");
	}

	nav_items.forEach((item) => {
		if (
			item.id !== "intro-btn" &&
			item.id !== "theory-btn" &&
			item.id !== "about-btn"
		) {
			item.classList.remove("active");
			if (
				item.dataset.view &&
				item.dataset.view === view_id.replace("-view", "")
			) {
				item.classList.add("active");
			}
		}
	});

	const view_titles = {
		dashboard: "Dashboard",
		calendar: "Schedule & Appointments",
		patients: "Patient Records",
		records: "Medical Records",
		medications: "Medications",
		settings: "Settings"
	};
	view_title.textContent =
		view_titles[view_id.replace("-view", "")] || "Dashboard";

	sidebar.classList.remove("active");
	overlay.classList.remove("active");
}

function openModal(sectionId) {
	document.querySelectorAll(".modal-section").forEach((section) => {
		section.classList.remove("active");
	});

	const targetSection = document.getElementById(sectionId);
	if (targetSection) {
		targetSection.classList.add("active");
	}

	info_modal.classList.add("active");
	playSound(sounds.page_turn);
}

function updateDoctorView() {
	const current_patient = patients[current_patient_index];
	if (current_patient) {
		current_patient_name.textContent = current_patient.name;
		current_patient_turn.textContent = current_patient.turn;
		current_patient_avatar.textContent = current_patient.initials;
		current_patient_age.textContent = `${current_patient.age} years old`;
		current_patient_condition.textContent = current_patient.condition;
		current_turn_display.textContent = current_patient.turn;

		document.getElementById("diagnosis").value = current_patient.condition;
		document.getElementById("symptoms").value = "Elevated BP, Mild Headache";
		document.getElementById("treatment").value = current_patient.action;

		const next_visit = new Date();
		next_visit.setDate(next_visit.getDate() + 14);
		document.getElementById("next-visit").value = next_visit
			.toISOString()
			.split("T")[0];
	}

	prev_patient_btn.disabled = current_patient_index === 0;
	next_patient_btn.disabled = current_patient_index === patients.length - 1;
	next_patient_btn_2.disabled = current_patient_index === patients.length - 1;

	patient_screen_prev.disabled = current_patient_index === 0;
	patient_screen_next.disabled = current_patient_index === patients.length - 1;
}

function updatePatientView() {
	const current_patient = patients[current_patient_index];
	if (current_patient) {
		patient_turn_display.textContent = current_patient.turn;
		patient_name.textContent = current_patient.name;
		patient_room.textContent = current_patient.room;

		const turn_display = document.getElementById("patient-turn-display");
		turn_display.style.animation = "none";
		setTimeout(() => {
			turn_display.style.animation = "bounceIn 1s ease";
		}, 10);
	}
}

function updateQueue() {
	patient_queue.innerHTML = "";
	patients.forEach((patient, index) => {
		if (index >= current_patient_index) {
			const queue_item = document.createElement("div");
			queue_item.className = `queue-item ${
				index === current_patient_index ? "active" : ""
			}`;
			queue_item.innerHTML = `
						<div class="queue-avatar">${patient.initials}</div>
						<div class="queue-info">
							<h4>${patient.name}</h4>
							<p>Turn ${patient.turn} • ${patient.time} • ${patient.department}</p>
						</div>
					`;
			queue_item.addEventListener("click", () => {
				if (index !== current_patient_index) {
					current_patient_index = index;
					updateAllViews();
					playSound(sounds.page_turn);
				}
			});
			patient_queue.appendChild(queue_item);
		}
	});
	queue_count.textContent = `${
		patients.length - current_patient_index - 1
	} waiting`;
}

function updateStats() {
	total_patients.textContent = patients.length;
	completed_patients.textContent = current_patient_index;
	waiting_patients.textContent = patients.length - current_patient_index - 1;

	const avg_wait_time = Math.round(
		patients.reduce((sum, patient) => {
			const wait_time = (new Date() - patient.arrival_time) / 60000;
			return sum + wait_time;
		}, 0) / patients.length
	);

	avg_time.textContent = `${avg_wait_time} min`;

	const progress = (current_patient_index / patients.length) * 100;
	progress_fill.style.width = `${progress}%`;
}

function updateCalendar() {
	calendar_days.innerHTML = "";
	const first_day = new Date(current_year, current_month, 1);
	const last_day = new Date(current_year, current_month + 1, 0);
	const days_in_month = last_day.getDate();
	const starting_day = first_day.getDay();

	for (let i = 0; i < starting_day; i++) {
		const empty_day = document.createElement("div");
		empty_day.className = "calendar-day";
		calendar_days.appendChild(empty_day);
	}

	const today = new Date();
	const is_current_month =
		today.getMonth() === current_month && today.getFullYear() === current_year;

	for (let day = 1; day <= days_in_month; day++) {
		const day_element = document.createElement("div");
		day_element.className = "calendar-day";
		day_element.textContent = day;

		if (is_current_month && day === today.getDate()) {
			day_element.classList.add("today");
		}

		if (Math.random() > 0.7) {
			day_element.classList.add("appointment");
		}

		day_element.addEventListener("click", () => {
			document.querySelectorAll(".calendar-day").forEach((d) => {
				d.classList.remove("selected");
			});
			day_element.classList.add("selected");
			showAppointmentsForDay(day);
		});
		calendar_days.appendChild(day_element);
	}

	const month_names = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	document.getElementById(
		"current-month"
	).textContent = `${month_names[current_month]} ${current_year}`;
}

function updateAppointments() {
	const today_appointments = document.getElementById("today-appointments");
	const upcoming_appointments = document.getElementById("upcoming-appointments");

	today_appointments.innerHTML = "";
	appointments.slice(0, 3).forEach((appointment) => {
		const item = document.createElement("div");
		item.className = "appointment-item";
		item.innerHTML = `
					<div class="appointment-time">
						<i class="fas fa-clock"></i>
						${appointment.time}
					</div>
					<div class="appointment-patient">${appointment.patient}</div>
					<div class="appointment-type">${appointment.type} with ${appointment.doctor}</div>
				`;
		today_appointments.appendChild(item);
	});

	upcoming_appointments.innerHTML = "";
	appointments.slice(3, 6).forEach((appointment) => {
		const item = document.createElement("div");
		item.className = "appointment-item";
		item.innerHTML = `
					<div class="appointment-time">
						<i class="fas fa-clock"></i>
						${appointment.time}
					</div>
					<div class="appointment-patient">${appointment.patient}</div>
					<div class="appointment-type">${appointment.type} with ${appointment.doctor}</div>
				`;
		upcoming_appointments.appendChild(item);
	});
}

function showAppointmentsForDay(day) {
	showNotification(
		`Appointments for ${day}/${current_month + 1}/${current_year}`
	);
}

function updatePatientList() {
	const patient_list = document.getElementById("patient-list");
	const patient_history_list = document.getElementById("patient-history-list");

	patient_list.innerHTML = "";
	patient_history_list.innerHTML = "";

	patients.forEach((patient, index) => {
		const list_item = document.createElement("div");
		list_item.className = `patient-list-item ${
			index === current_patient_index ? "active" : ""
		}`;
		list_item.innerHTML = `
					<div class="patient-list-name">${patient.name}</div>
					<div class="patient-list-details">
						<span>${patient.age} yrs</span>
						<span>${patient.turn}</span>
					</div>
				`;

		list_item.addEventListener("click", () => {
			document.querySelectorAll(".patient-list-item").forEach((item) => {
				item.classList.remove("active");
			});
			list_item.classList.add("active");
			showPatientHistory(patient.id);
		});
		patient_list.appendChild(list_item);
	});

	if (patients[current_patient_index]) {
		showPatientHistory(patients[current_patient_index].id);
	}
}

function showPatientHistory(patient_id) {
	const patient_history_list = document.getElementById("patient-history-list");
	const history = generatePatientHistory(patient_id);

	patient_history_list.innerHTML = "";
	history.forEach((entry) => {
		const history_item = document.createElement("div");
		history_item.className = "history-item";
		history_item.innerHTML = `
					<div class="history-date">${entry.date}</div>
					<div class="history-diagnosis">${entry.diagnosis}</div>
					<div class="history-doctor">
						<i class="fas fa-user-md"></i>
						<span>${entry.doctor}</span>
					</div>
					<div class="history-notes">${entry.notes}</div>
				`;
		patient_history_list.appendChild(history_item);
	});
}

function updateCurrentDate() {
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	current_date_element.textContent = new Date().toLocaleDateString(
		"en-US",
		options
	);
}

function addNewPatient() {
	const new_patient = generatePatient(patients.length);
	patients.push(new_patient);
	showNotification(
		`New patient added: ${new_patient.name} (${new_patient.turn})`
	);
	updatePatientList();
}

function playSound(sound) {
	sound.currentTime = 0;
	sound.play().catch((e) => console.log("Sound play failed:", e));
}

function announcePatient() {
	if ("speechSynthesis" in window) {
		const current_patient = patients[current_patient_index];
		if (!current_patient) return;

		window.speechSynthesis.cancel();

		const text = `Now serving ${current_patient.name}, turn number ${current_patient.turn}. Please proceed to room ${current_patient.room}.`;
		const utterance = new SpeechSynthesisUtterance(text);

		if (voices.length === 0) {
			voices = window.speechSynthesis.getVoices();
		}

		const preferred_voice = voices.find(
			(v) => v.name.includes("Microsoft Ava") || v.name.includes("Ava")
		);

		if (preferred_voice) {
			utterance.voice = preferred_voice;
		} else {
			const fallback_voice = voices.find(
				(v) =>
					(v.name.includes("Microsoft Michelle") ||
						v.name.includes("Google US English") ||
						v.name.includes("Microsoft Zira") ||
						v.name.includes("Samantha") ||
						v.name.includes("Victoria")) &&
					v.lang.includes("en")
			);
			if (fallback_voice) utterance.voice = fallback_voice;
		}

		utterance.rate = 0.95;
		utterance.pitch = 1.0;

		utterance.onstart = () => {
			sound_toggle.classList.add("speaking");
			is_speaking = true;
		};

		utterance.onend = () => {
			sound_toggle.classList.remove("speaking");
			is_speaking = false;
		};

		window.speechSynthesis.speak(utterance);
	} else {
		showNotification("Text-to-speech not supported");
	}
}

function showNotification(message) {
	notification_text.textContent = message;
	notification.style.display = "flex";
	playSound(sounds.notification);
	setTimeout(() => {
		notification.style.display = "none";
	}, 3000);
}

function updateAllViews() {
	updateDoctorView();
	updatePatientView();
	updateQueue();
	updateStats();
	updatePatientList();
}

function goToNextPatient() {
	if (current_patient_index < patients.length - 1) {
		current_patient_index++;
		updateAllViews();
		playSound(sounds.ding);
		showNotification(
			`Now serving: ${patients[current_patient_index].name} (${patients[current_patient_index].turn})`
		);
		announcePatient();
	}
}

function goToPrevPatient() {
	if (current_patient_index > 0) {
		current_patient_index--;
		updateAllViews();
		playSound(sounds.page_turn);
	}
}

function setupKeyboardNavigation() {
	document.addEventListener("keydown", (e) => {
		if (e.key === "ArrowRight") {
			goToNextPatient();
		} else if (e.key === "ArrowLeft") {
			goToPrevPatient();
		}
	});
}

function setupEventListeners() {
	doctor_view_btn.addEventListener("click", () => {
		doctor_view_btn.classList.add("active");
		patient_view_btn.classList.remove("active");
		doctor_view.style.display = "flex";
		patient_view.classList.remove("active");
		playSound(sounds.page_turn);
	});

	patient_view_btn.addEventListener("click", () => {
		patient_view_btn.classList.add("active");
		doctor_view_btn.classList.remove("active");
		doctor_view.style.display = "none";
		patient_view.classList.add("active");
		playSound(sounds.page_turn);
		updatePatientView();
	});

	sound_toggle.addEventListener("click", () => {
		announcePatient();
	});

	nav_items.forEach((item) => {
		if (
			item.id !== "intro-btn" &&
			item.id !== "theory-btn" &&
			item.id !== "about-btn"
		) {
			item.addEventListener("click", (e) => {
				e.preventDefault();
				const view_id = `${item.dataset.view}-view`;
				switchView(view_id);
				playSound(sounds.page_turn);
			});
		}
	});

	next_patient_btn.addEventListener("click", goToNextPatient);
	next_patient_btn_2.addEventListener("click", goToNextPatient);

	prev_patient_btn.addEventListener("click", goToPrevPatient);

	patient_screen_prev.addEventListener("click", goToPrevPatient);
	patient_screen_next.addEventListener("click", goToNextPatient);

	prev_month_btn.addEventListener("click", () => {
		current_month--;
		if (current_month < 0) {
			current_month = 11;
			current_year--;
		}
		updateCalendar();
		playSound(sounds.page_turn);
	});

	next_month_btn.addEventListener("click", () => {
		current_month++;
		if (current_month > 11) {
			current_month = 0;
			current_year++;
		}
		updateCalendar();
		playSound(sounds.page_turn);
	});

	document.getElementById("today-btn").addEventListener("click", () => {
		const today = new Date();
		current_month = today.getMonth();
		current_year = today.getFullYear();
		updateCalendar();
		playSound(sounds.ding);
	});

	document.getElementById("save-notes-btn").addEventListener("click", () => {
		showNotification("Patient notes saved successfully!");
		playSound(sounds.success);
	});

	document.getElementById("complete-visit-btn").addEventListener("click", () => {
		showNotification("Visit marked as completed!");
		playSound(sounds.success);
		setTimeout(goToNextPatient, 1500);
	});

	document
		.getElementById("add-appointment-btn")
		.addEventListener("click", () => {
			showNotification("Add appointment feature coming soon!");
			playSound(sounds.ding);
		});

	document.getElementById("new-patient-btn").addEventListener("click", () => {
		addNewPatient();
		playSound(sounds.success);
	});

	hamburger_btn.addEventListener("click", () => {
		sidebar.classList.add("active");
		overlay.classList.add("active");
	});

	overlay.addEventListener("click", () => {
		sidebar.classList.remove("active");
		overlay.classList.remove("active");
	});

	intro_btn.addEventListener("click", () => openModal("intro-section"));
	theory_btn.addEventListener("click", () => openModal("theory-section"));
	about_btn.addEventListener("click", () => openModal("about-section"));

	close_info_btn.addEventListener("click", () => {
		info_modal.classList.remove("active");
	});

	info_modal.addEventListener("click", (e) => {
		if (e.target === info_modal) {
			info_modal.classList.remove("active");
		}
	});

	const context_menu = document.getElementById("context-menu");

	document.addEventListener("contextmenu", (e) => {
		e.preventDefault();

		const x = e.pageX;
		const y = e.pageY;

		context_menu.style.left = `${x}px`;
		context_menu.style.top = `${y}px`;
		context_menu.style.display = "block";
	});

	document.addEventListener("click", () => {
		context_menu.style.display = "none";
	});

	document.getElementById("ctx-next").addEventListener("click", goToNextPatient);
	document.getElementById("ctx-prev").addEventListener("click", goToPrevPatient);
	document
		.getElementById("ctx-sound")
		.addEventListener("click", announcePatient);
	document.getElementById("ctx-refresh").addEventListener("click", () => {
		updateQueue();
		showNotification("Queue refreshed");
	});
}

document.addEventListener("DOMContentLoaded", initApp);

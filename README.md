# PrepPulse 

PrepPulse is a smart, free web application built to help job seekers prepare for interviews and create tailored resumes in seconds. 

Instead of dealing with generic advice, you simply upload your resume and paste the job description you are targeting. PrepPulse uses advanced AI to instantly analyze both, pointing out exactly what skills you might be missing for the role, mapping out a custom day-by-day study plan, and generating a perfectly formatted resume tailored to that exact job.

---

## ⚡ What It Does (Key Features)

* **No Signup Required:** Anyone can use it instantly as a guest—no restrictive login or account creation walls.
* **Smart Resume Reading:** Just upload your standard PDF resume, and the app automatically extracts and reads your experience.
* **Realistic Mock Interview Practice:** Generates custom technical and behavioral questions for your specific job target. Each question includes:
  * **Interviewer's Intention:** What the interviewer is *actually* looking for.
  * **Model Answer:** Guidelines on core concepts you should mention.
  * **Sample Answer:** A realistic, first-person response ("I built...", "In my experience...") written exactly how a top-tier candidate would speak during the live interview.
* **Custom Study Roadmap:** Breaks down your preparation into a realistic, day-by-day task list focused purely on what matters for the job.
* **Skill Gap Alerts:** Tells you exactly where your profile falls short compared to the job description, ranking gaps by severity (Low, Medium, or High) so you know what to study first.
* **Instant Resume Generation:** Builds a beautifully formatted, professional, ATS-friendly HTML resume tailored to the job description that you can download instantly and print to PDF.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
* **React.js** – Powers the smooth, fast single-page user interface.
* **Tailwind CSS & SCSS** – Handles the clean, modern dark-themed responsive styling.
* **React Router & Context API** – Keeps page transitions fast and manages global state seamlessly.

### Backend (Server & Database)
* **Node.js & Express.js** – Runs the background application server environment.
* **MongoDB & Mongoose** – Stores generated interview reports safely (built with a flexible schema to handle both registered users and guest accounts).
* **Gemini 2.5 Flash (`@google/genai`)** – The high-speed generative AI engine driving the analysis, roadmap logic, and mock questions.
* **pdf-parse** – Efficiently reads text out of uploaded PDF resumes directly on the server.

---

## ⚙️ Setting Up Environment Variables

### Backend Setup
Create a `.env` file inside your `Backend/Backend/` folder:
```env
PORT=10000
MONGO_URI=your_mongodb_connection_string
GOOGLE_GENAI_API_KEY=your_gemini_api_key
SESSION_SECRET=preppulse_secret_key

import "./App.css";
import { TopicQuiz } from "./Components/TopicQuiz.jsx";
import { Footer } from "./Components/Footer/Footer.jsx";
import { NewQuizPage } from "./Pages/NewQuizPage.jsx";
import { Login } from "./Components/auth/Login.jsx";
import { Register } from "./Components/auth/Register.jsx";
import { Route, Routes } from "react-router-dom";
import { Admin } from "./Components/Admin/Admin.jsx";
import { QuizForm } from "./Components/Admin/QuizForm.jsx";
import { ProfileMain } from "./Components/Profile/ProfileMain.jsx";
import { Quizes } from "./Components/QuizNew/Quizes.jsx";
import { Navbarnew } from "./Components/Navbar/Navbarnew.jsx";
import { Resultshow } from "./Pages/Resultshow.jsx";
import { ShowAllAnswers } from "./Pages/ShowAllAnswers.jsx";
import { About } from "./Components/About/About.jsx";
import { Contact } from "./Components/Contact/Contact.jsx";
import { Feedback } from "./Components/Feedback/Feedback.jsx";
import { FAQ } from "./Components/FAQ/FAQ.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminFeedbackContact from "./Pages/AdminFeedbackContact.jsx";
import ChatbotWidget from "./Components/ChatbotWidget";
import AdminPanel from "./Pages/AdminPanel.jsx";
import Attempts from "./Pages/Attempts.jsx";
import Leaderboard from "./Pages/Leaderboard.jsx";

function App() {
  return (
    <div className="App bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbarnew />
      <Routes>
        <Route path="/" element={<TopicQuiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/HTML" element={<NewQuizPage />} />
        <Route path="/CSS" element={<NewQuizPage />} />
        <Route path="/Javascript" element={<NewQuizPage />} />
        <Route path="/React" element={<NewQuizPage />} />
        <Route path="/quiz/:id" element={<Quizes />} />
        <Route path="/Mongodb" element={<NewQuizPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/addquiz" element={<QuizForm />} />
        <Route path="/profile" element={<ProfileMain />} />
        <Route path="/result" element={<Resultshow />} />
        <Route path="/showallanswer" element={<ShowAllAnswers />} />
        <Route path="/admin-feedback-contact" element={<AdminFeedbackContact />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/attempts" element={<Attempts />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

export default App;

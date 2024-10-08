import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import QuestionCard from "@/components/QuestionCard";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
const CategoryTab = ({ activeCategory = "All", title, handleCategory }) => {
  return (
    <div
      onClick={() => handleCategory(title)}
      className={`mx-4 px-6 py-2 bg-altLight rounded-full cursor-pointer ${
        activeCategory === title && "bg-primaryDark"
      }`}
    >
      {title}
    </div>
  );
};
const PostQuestion = ({ hidden = true, userDetails, getQuestions }) => {
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // window.location.reload();
    let qItem = {
      username: userDetails[0],
      question: newQuestion,
      answer: "",
      type: "unanswered",
      therapist_name: "",
      therapist_rating: 0,
    };

    // console.log(qItem);

    const response = await axios.post(
      "http://localhost:8000/up_questions",
      qItem
    );
    getQuestions();
  };

  const openPostSection = () => {
    isPostOpen ? setIsPostOpen(false) : setIsPostOpen(true);
  };
  return (
    <div className={`flex flex-col mx-4 my-6`}>
      <div
        onClick={() => openPostSection()}
        className="mb-2 flex flex-row text-xl items-center font-semibold text-acc hover:underline cursor-pointer w-fit"
      >
        <PostAddIcon className="mr-3" />
        <h3>Post a Question</h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className={`w-full ${!isPostOpen && "hidden"}`}
      >
        <textarea
          className="rounded-md w-full py-3 px-6 h-[150px] border-2 border-solid border-dark border-opacity-50 text-dark text-opacity-60"
          placeholder="What do you have in mind?"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button className="bg-acc2 px-5 py-2 text-light bg-dark rounded-md">
          Post
        </button>
      </form>
    </div>
  );
};

const question = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [userDetails, setUserDetails] = useState([]);
  const [qList, setQList] = useState([]);
  const router = useRouter();

  const getQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get_questions", {
        params: {
          username: userDetails[0],
        },
      });

      setQList(response?.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    const savedUserName = localStorage.getItem("username");
    const savedUserType = localStorage.getItem("usertype");
    if (!token) {
      router.push("/login");
    }
    if (savedUserType === "doctor") {
      router.push("/login");
      // alert("hh");
    } else {
      setUserDetails([savedUserName, savedUserType]);
      // setMode("dark");
    }
  }, []);
  const handleCategory = (cat) => {
    setActiveCategory(cat);
  };
  useEffect(() => {
    getQuestions();
  }, [userDetails[0]]);
  return (
    <Layout pageTitle="Your Questions" sideTab="Home" username={userDetails[0]}>
      <div>
        <PostQuestion userDetails={userDetails} getQuestions={getQuestions} />
        <div className="flex flex-row my-5">
          <CategoryTab
            handleCategory={handleCategory}
            activeCategory={activeCategory}
            title="All"
          />
          <CategoryTab
            handleCategory={handleCategory}
            activeCategory={activeCategory}
            title="Answered"
          />
          <CategoryTab
            handleCategory={handleCategory}
            activeCategory={activeCategory}
            title="Unanswered"
          />
        </div>
        <div className="flex flex-col items-center">
          {qList.toReversed().map((q, ind) => {
            if (activeCategory === "All") {
              return (
                <QuestionCard
                  key={ind}
                  question={q.question}
                  answer={q.answer}
                  type={q.type}
                  therapist_name={q.therapist_name}
                  therapist_rating={q.therapist_rating}
                />
              );
            } else {
              return (
                activeCategory.toLowerCase() === q.type && (
                  <QuestionCard
                    key={ind}
                    question={q.question}
                    answer={q.answer}
                    type={q.type}
                    therapist_name={q.therapist_name}
                    therapist_rating={q.therapist_rating}
                  />
                )
              );
            }
          })}
        </div>
      </div>
    </Layout>
  );
};

export default question;

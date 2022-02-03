import { motion } from "framer-motion"

const App = () => {

  const pVariants = {
    initial: {
      y: "50%",
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 1
      }
    }
  }
  const pVariants2 = {
    initial: {
      y: "30%",
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 1.5
      }
    }
  }
 const divVariants = {
    initial: {
      y: "30%",
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 2
      }
    }
  }
  return (
    <div className="flex flex-col h-screen w-screen font-noto">
        <div className="z-10 w-full h-20 flex items-center justify-between ">
          <div className="flex items-center justify-between w-full mx-20">
            {/* logo */}
            <img className="h-28" src="logo/Ollim-logos_transparent.png" alt="header logo" />

            {/* menu div */}
            <div className="flex font-normal text-white">
              {/* <span className="">Login</span>
              <span className="mx-10">Login</span>
              <span className="mr-10">Login</span>
              <span>Login</span> */}
            </div>
          </div>
        </div>

      <div className="w-1/2 h-full flex z-10 items-center jutify-center">
        <div className="w-full flex flex-col z-10 items-center">
          <motion.p
            variants={pVariants}
            initial="initial"
            animate="animate"
            className="w-1/2 text-3xl whitespace-pre-line mb-10 font-black">
            안녕하세요! {`\n`} 우리는 <span className="text-4xl text-logoBrown font-black">올림</span> 입니다
          </motion.p>
          
          <motion.p
            variants={pVariants2}
            initial="initial"
            animate="animate"
            className="w-1/2 text-lg font-extrabold">작가님의 포트폴리오를 관리하고, 다른 작가들의 글을 열람하세요!</motion.p>
          <motion.div
            variants={divVariants}
            initial="initial"
            animate="animate"
            className="w-1/2 flex items-center justify-evenly mt-7 text-sm">
              <motion.button
                whileHover={{ y: "-10%" }}
                className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold">
              로그인
              </motion.button>
              <motion.button
                whileHover={{ y: "-10%" }}
                className="px-5 py-3 rounded-2xl bg-[#c69e92] shadow-md font-semibold">
              다른 작가들의 글
              </motion.button>
        </motion.div>
        </div>
      </div>


      <div className="-z-0 absolute top-0 left-0 w-full h-full opacity-80">
        <img className="w-full h-full" src="backgroundImage/main.jpg" alt="background" />
      </div>
    </div>
  );
}

export default App;

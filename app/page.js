import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex gap-2 justify-center transition-all ease-in-out duration-1000 w-[90%] mx-auto text-white flex-col pt-3 h-[40vh] items-center">
        <div className="font-bold flex justify-center transition-all ease-in-out duration-1000 items-center text-3xl md:text-5xl">
          Buy Me a Chai{" "}
          <span>
            <img  className="w-15 md:w-22 " src="/tea.gif" alt="tea" />
          </span>{" "}
        </div>
        <p>
          A crowdfunding plateform for creators. Get funded by your fans and
          followers. Start now!
        </p>
        <div className="flex sm:flex-row transition-all ease-in-out duration-1000 flex-col gap-4">
          <Link href={"/login"}>
            <button
              type="button"
              className="rounded-xl text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
            >
              Start Here
            </button>
          </Link>
          <Link href={"/about"}>
            <button
              type="button"
              className="rounded-xl text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>
      <div className="bg-white h-0.5 opacity-10"></div>
      <div className="text-white container mx-auto pb-26 pt-14">
        <h2 className="text-3xl font-bold text-center mb-14">
          Your fans can buy you a Chai
        </h2>
        <div className="flex gap-5 transition-all ease-in-out duration-1000 md:flex-row flex-col items-center justify-around">
          <div className=" space-y-1 flex justify-center items-center flex-col">
            <img
              src="/man.gif"
              className="bg-gray-400 rounded-full p-2"
              width={88}
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className="w-3/4 text-center">Your fans are available for you to help you</p>
          </div>
          <div className=" space-y-1 flex justify-center items-center flex-col">
            <img
              src="/coin.gif"
              className="bg-gray-400 rounded-full p-2"
              width={88}
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className="w-3/4 text-center">Your fans are available for you to help you</p>
          </div>
          <div className=" space-y-1 flex justify-center items-center flex-col">
            <img
              src="/group.gif"
              className="bg-gray-400 rounded-full p-2"
              width={88}
              alt=""
            />
            <p className="font-bold">Fans want to help</p>
            <p className="w-3/4 text-center">Your fans are available for you to help you</p>
          </div>
        </div>
      </div>

      <div className="bg-white h-0.5 opacity-10"></div>
      <div className="text-white container flex flex-col justify-center items-center mx-auto pb-26 pt-14">
        <h2 className="text-3xl font-bold text-center mb-14">
          Learn more about us
        </h2>
        <iframe className="w-[90%] h-[50vh] lg:h-[60vh]" src="https://www.youtube.com/embed/2lkZoSrx-Kg?si=JYgc9EIFSI4TXutr" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        
      </div>
    </>
  );
}

import React, { useState } from "react";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "John Fang",
      website: "wordfaang.com",
      review:
        "Suspendisse ultrices at diam lectus nullam. Nisl, sagittis viverra enim erat tortor ultricies massa turpis. Arcu pulvinar aenean nam laoreet nulla.",
      image:
        "https://s3-alpha-sig.figma.com/img/515d/ff9e/da4d74b6ffcfa490d831317ff20eb608?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RIScfyzckrq5d4~uJsJ0tWeS~TKl85gSiO~ZlEy5Z1DxKvBL6VFSBYHTvMAaqSX-CsLcV9GLhoEKdiyw7huIPqZ5~HOK9po6fzq4KA-t5pb0-gUNpPxIeXdrggIUURcDM6rIoJik8ui9zScFql3uhmeLacpQU6X4wEeP4nC6RHUwGszqtv0TB06WjpFHOg3IsFsqzEKiYhbN~L674b8sa0UmyyyME6an6n-LYNbghk9UltRaZ~VtR9-P-Z4lgxbOrYS0PvhPssRgKXKKTA7rc6FTpFDtoB8xvkB1joKMNJmOJEnkF5H-nLxfqpvboUS~-~7pPUZ~c2-px3wE~clPwQ__",
    },
    {
      name: "Jane Doe",
      website: "janedoe.com",
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Alice Smith",
      website: "alicesmith.com",
      review:
        "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec id elit non mi porta gravida at eget metus.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Alice Smith",
      website: "alicesmith.com",
      review:
        "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec id elit non mi porta gravida at eget metus.",
      image: "https://via.placeholder.com/80",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToSlide = (index: React.SetStateAction<number>) => {
    setCurrentIndex(index);
  };
  return (
<div className="m-auto w-full max-w-[1120px] p-3">

  <div className="flex pt-3 justify-between pb-20 flex-col sm:flex-row items-center">
    <div className="flex items-center gap-4">
      <img src="logo.png" alt="Logo" className="w-10 h-10" />
      <span className="text-2xl font-bold">NC</span>
    </div>
    <div className="flex gap-4 mt-4 sm:mt-0">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Profile</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
    </div>
  </div>


  <div className="flex flex-col lg:flex-row">
    <div className="w-full lg:w-1/2 text-center lg:text-left">
      <h1 className="font-semibold text-[40px] lg:text-[80px]">Save your data storage here.</h1>
      <p className="w-full lg:w-[390px] text-[16px] lg:text-[19px] pt-5 pb-8">
        Data Warehouse is a data storage area that has been tested for security, so you can store your data here safely but not be afraid of being stolen by others.
      </p>
      <button className="bg-[#9900FF] text-white rounded-2xl w-32 h-10 transition-colors hover:bg-[#9933CC]">
        Learn more
      </button>
    </div>
    <div className="w-full lg:w-1/2 flex justify-center">
      <img
        className="w-[300px] h-[200px] lg:w-[550px] lg:h-[300px] mt-10 lg:mt-32"
        src="image.png"
        alt="Data Storage Image"
      />
    </div>
  </div>


  <h2 className="text-center font-bold text-[32px] lg:text-[48px] pt-16">Features</h2>
  <p className="pt-5 m-auto w-[90%] sm:w-[70%] lg:w-[40%] text-center">
    Some of the features and advantages that we provide for those of you who store data in this Data Warehouse.
  </p>
  <div className="flex flex-col lg:flex-row lg:justify-between">
    <div className="w-full lg:w-[47%] flex gap-5 flex-col sm:flex-row">
      <div className="flex items-start gap-4">
        <img src="feature-icon1.png" alt="Feature Icon 1" className="w-10 h-10" />
        <div>
          <h3 className="font-semibold text-[18px]">Search Data</h3>
          <p className="text-[14px]">
            Don’t worry if your data is very large, the Data Warehouse provides a search engine, which is useful for making it easier to find data effectively saving time.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <img src="feature-icon2.png" alt="Feature Icon 2" className="w-10 h-10" />
        <div>
          <h3 className="font-semibold text-[18px]">24 Hours Access</h3>
          <p className="text-[14px]">
            Access is given 24 hours a full morning to night and meets various needs of effective use.
          </p>
        </div>
      </div>
    </div>
    <div className="w-full lg:w-[47%] flex gap-5 flex-col sm:flex-row">
      <div className="flex items-start gap-4">
        <img src="feature-icon3.png" alt="Feature Icon 3" className="w-10 h-10" />
        <div>
          <h3 className="font-semibold text-[18px]">Print Out</h3>
          <p className="text-[14px]">
            Print out service gives you convenience if someday you need print data, just edit it all and just print it.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <img src="feature-icon4.png" alt="Feature Icon 4" className="w-10 h-10" />
        <div>
          <h3 className="font-semibold text-[18px]">Security Code</h3>
          <p className="text-[14px]">
            Data Security is one of our best facilities. Allows for securing your files so they are not easily accessed by others.
          </p>
        </div>
      </div>
    </div>
  </div>


  <div className="bg-[#9900FF] h-auto lg:h-[700px] rounded-[30px] mt-20 m-auto p-5 lg:p-0">
    <h1 className="text-white text-[32px] lg:text-[40px] font-semibold m-[40px] lg:m-[80px] pt-14">
      Testimonials
    </h1>
    <div className="flex flex-col lg:flex-row pl-[60px] gap-2 items-center">
      <span
        onClick={handlePrev}
        className="text-white text-[30px] lg:text-[50px] cursor-pointer hover:text-red-500 transition-colors"
      >
        &#x2190;
      </span>
      <div className="w-[90%] lg:w-[85%] bg-white h-auto lg:h-[350px] rounded-2xl flex flex-col lg:flex-row p-4 lg:pl-32 pt-8 lg:pt-16">
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
          <img src="avatar.png" alt="Avatar" className="w-[80px] h-[80px] lg:w-[150px] lg:h-[150px] rounded-full" />
        </div>
        <div className="text-center lg:text-left w-full lg:w-2/3 lg:pl-4 pt-4 lg:pt-0">
          <h3 className="font-semibold text-[18px]">John Doe</h3>
          <p className="text-[14px]">
            Very easy to use. Thank you so much for making these free resources available to us!
          </p>
        </div>
      </div>
      <span
        onClick={handleNext}
        className="text-white text-[30px] lg:text-[50px] cursor-pointer hover:text-red-500 transition-colors"
      >
        &#x2192;
      </span>
    </div>
    <div className="flex justify-center mt-8">
      {testimonials.map((_, index) => (
        <div
          key={index}
          onClick={() => goToSlide(index)}
          className={`w-2 h-2 mx-2 rounded-full cursor-pointer ${
            currentIndex === index ? "bg-[#cf38b6]" : "bg-[#ffffff]"
          }`}
        />
      ))}
    </div>
  </div>
</div>

  );
};

export default Home;


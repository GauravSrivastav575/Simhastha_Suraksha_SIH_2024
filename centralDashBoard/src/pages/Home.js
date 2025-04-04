import React, { useEffect, useState } from "react";

function Home() {
  const [unreslovedReports, setUnreslovedReports] = useState([]);
  const [bags, setBags] = useState([]);
  useEffect(() => {
    async function fetchUnresolvedReports() {
      let url = "http://192.168.137.8:5000/unResolvedReports";
      // let url = "https://server-sih-1.onrender.com/unResolvedReports";
      try {
        let result = await fetch(url);
        result = await result.json();
        if (result.success) {
          setUnreslovedReports(result.data);
        }
      } catch (err) {
        console.log("error: ", err);
      }
    }
    async function fetchBags() {
      let url = "http://192.168.137.8:5000/getBag";
      // let url = "https://server-sih-1.onrender.com/unResolvedReports";
      try {
        let result = await fetch(url);
        result = await result.json();
        if (result.success) {
          setBags(result.data);
        }
      } catch (err) {
        console.log("error: ", err);
      }
    }
    fetchUnresolvedReports();
    fetchBags();
  }, []);
  async function sendConfirmPerson(reportId, isNotify) {
    console.log("caledddd");
    // let url = 'https://server-sih-1.onrender.com/notifyNearByOfficers';
    // if(isNotify) url = 'https://server-sih-1.onrender.com/resolveReport';
    let url = "http://192.168.137.8:5000/notifyNearByOfficers";
    if (isNotify) url = "http://192.168.137.8:5000/resolveReport";
    try {
      let result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the header for JSON
        },
        body: JSON.stringify({ reportId }), // Properly stringify the data
      });

      // Parsing the response as JSON
      result = await result.json();
      console.log(result);
      // Check if login was successful
      if (result.success) {
        if (!isNotify) {
          const updatedReports = unreslovedReports.map((report) => {
            if (report._id === reportId) {
              return { ...report, isNotify: true };
            }
            return report;
          });
          setUnreslovedReports(updatedReports);
        } else {
          setUnreslovedReports((prevReports) =>
            prevReports.filter((report) => report._id !== reportId)
          );
        }
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  }
  useEffect(() => {}, [unreslovedReports]);
  return (
    <>
      <div className="flex w-full min-h-screen">
        <div className="flex flex-col w-3/5 min-h-screen h-screen border-r-2 border-gray-300">
          <div className="px-3 py-2 text-2xl font-semibold text-gray-800">
            List of Searched people
          </div>
          <div className="flex-1 w-full border-y-2 border-gray-300 overflow-y-auto">
            {/* <div className="flex justify-around items-center p-2">
              <div className="text-xl mx-3">1.</div>
              <div className="flex justify-center items-center gap-4">
                <div className="w-1/3 aspect-square flex justify-center items-center mx-2">
                  <img
                    src="https://res.cloudinary.com/dcbrfuldz/image/upload/v1733833819/YelpCamp/b9a84a42c5abdf8db11d3aef1cd06348_sqmj7q.jpg"
                    alt="err"
                    className="rounded-xl"
                  />
                </div>
                <div className="w-1/3 aspect-square flex justify-center items-center mx-2">
                  <img
                    src="https://res.cloudinary.com/dcbrfuldz/image/upload/v1733833819/YelpCamp/b9a84a42c5abdf8db11d3aef1cd06348_sqmj7q.jpg"
                    alt="err"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  sendConfirmPerson("gwvhs");
                }}
                className="py-2 px-3 text-lg font-semibold bg-blue-500 text-gray-50 rounded-xl"
              >
                Notify
              </button>
            </div> */}
            {unreslovedReports.map((unResolvedReport, index) => (
              <div className="flex justify-around items-center p-2">
                <div className="text-xl mx-3">{index + 1 + "."}</div>
                <div className="flex justify-center items-center gap-4">
                  <div className="w-1/3 aspect-square flex justify-center items-center mx-2">
                    <img
                      src={unResolvedReport.url}
                      alt="err"
                      className="rounded-xl object-cover h-full w-full "
                    />
                  </div>
                  <div className="w-1/3 aspect-square flex justify-center items-center mx-2">
                    <img
                      src={
                        unResolvedReport.history[
                          unResolvedReport.history.length - 1
                        ].url
                      }
                      alt="err"
                      className="rounded-xl object-cover h-full w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    sendConfirmPerson(
                      unResolvedReport._id,
                      unResolvedReport.isNotify
                    );
                  }}
                  className="py-2 px-3 text-lg font-semibold bg-blue-500 text-gray-50 rounded-xl"
                >
                  {unResolvedReport.isNotify ? "Resolve" : "Notify"}
                </button>
              </div>
            ))}
          </div>
          <div className="h-12 px-3 flex justify-end items-center">
            <div className="">27 Person Searching</div>
          </div>
        </div>
        <div className="flex flex-col w-2/5 min-h-screen h-screen">
          {/* <div className="w-full h-3/5 max-h-3/5 flex flex-col pb-1">
            <div className="font-semibold px-3 py-1 border-b-2 border-gray-200">
              Crime Insights
            </div>
            <div className="flex-1 overflow-y-auto pt-4 flex flex-col items-center gap-2 p-2">
              <div className="flex justify-around items-center gap-3">
                <div className="h-36 aspect-video bg-gray-950 rounded-xl flex justify-center items-center">
                  <video
                    src="https://res.cloudinary.com/ddv1qs3by/video/upload/f_auto,q_auto/v1733600332/crime_clips/hduzr3pd2r6lc0rjcj88.mp4"
                    className="h-full w-full object-contain rounded-xl"
                    controls
                    loop
                    autoPlay
                    muted
                  ></video>
                </div>
                <div className="">
                  <div>Camera: CAM01</div>
                  <div>Zone: 03</div>
                </div>
              </div>
              <div className="flex justify-around items-center gap-3">
                <div className="h-36 aspect-video bg-gray-950 rounded-xl flex justify-center items-center">
                  <video
                    src="https://res.cloudinary.com/ddv1qs3by/video/upload/f_auto,q_auto/v1733600332/crime_clips/hduzr3pd2r6lc0rjcj88.mp4"
                    className="h-full w-full object-contain rounded-xl"
                    controls
                    loop
                    autoPlay
                    muted
                  ></video>
                </div>
                <div className="">
                  <div>Camera: CAM01</div>
                  <div>Zone: 03</div>
                </div>
              </div>
              <div className="flex justify-around items-center gap-3">
                <div className="h-36 aspect-video bg-gray-950 rounded-xl flex justify-center items-center">
                  <video
                    src="https://res.cloudinary.com/ddv1qs3by/video/upload/f_auto,q_auto/v1733600332/crime_clips/hduzr3pd2r6lc0rjcj88.mp4"
                    className="h-full w-full object-contain rounded-xl"
                    controls
                    loop
                    autoPlay
                    muted
                  ></video>
                </div>
                <div className="">
                  <div>Camera: CAM01</div>
                  <div>Zone: 03</div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="w-full h-3/5 max-h-2/5 flex flex-col overflow-y-auto">
            <div className="font-semibold px-3 py-1 border-b-2 border-gray-200">
              Object Detection Insights
            </div>
            <div className="flex-1 overflow-y-auto border-b-2 border-gray-200 flex flex-col items-center gap-2 p-2">
              {/* <div className="flex justify-around items-center gap-3">
                <div className="w-28 aspect-video flex justify-center items-center mx-2">
                  <img
                    src="https://res.cloudinary.com/dcbrfuldz/image/upload/v1733833819/YelpCamp/b9a84a42c5abdf8db11d3aef1cd06348_sqmj7q.jpg"
                    alt="err"
                    className="rounded-lg"
                  />
                </div>
                <div className="">
                  <div>Camera: CAM01</div>
                  <div>Zone: 03</div>
                </div>
              </div> */}
              {bags.map((bag, index) => (
                <div
                  key={index}
                  className="flex justify-around items-center gap-3"
                >
                  <div className="w-40 aspect-video flex justify-center items-center mx-2">
                    <img src={bag.url} alt="err" className="rounded-lg" />
                  </div>
                  <div className="">
                    <div>Camera: CAM01</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

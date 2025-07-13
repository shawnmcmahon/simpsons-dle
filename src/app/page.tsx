import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Simpson's DLE</h1>
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png"
          alt="Homer Simpson"
          width={300}
          height={400}
          className="mx-auto"
          priority
        />
      </div>
      
      {/* 5 square boxes in a row */}
      <div className="flex gap-4 mb-8">
        <div className="w-16 h-16 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xl">
          1
        </div>
        <div className="w-16 h-16 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xl">
          2
        </div>
        <div className="w-16 h-16 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xl">
          3
        </div>
        <div className="w-16 h-16 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xl">
          4
        </div>
        <div className="w-16 h-16 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xl">
          5
        </div>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Text box 1"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Text box 2"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Text box 3"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Text box 4"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Text box 5"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

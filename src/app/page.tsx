import ChatWindow from "@/components/ChatWindow";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="fixed top-4 right-4 z-10">
        <Link 
          href="/admin" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          管理画面
        </Link>
      </div>
      <ChatWindow />
    </div>
  );
}

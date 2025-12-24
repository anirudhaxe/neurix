import { FileText, Clock } from "lucide-react";

export default function DocumentComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#4DB5CF] opacity-20 rounded-full blur-xl"></div>
        <div className="relative bg-[#4DB5CF]/10 border border-[#4DB5CF]/30 rounded-full p-4">
          <FileText className="h-8 w-8 text-[#4DB5CF]" />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">
          Document Processing
        </h3>
        <p className="text-sm font-medium text-[#4DB5CF]">Coming soon</p>
        <p className="text-sm text-gray-300 leading-relaxed">
          Document functionality is currently under development.
        </p>
      </div>
    </div>
  );
}

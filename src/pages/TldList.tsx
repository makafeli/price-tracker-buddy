import { TldMenu } from "@/components/TldMenu";

const TldList = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">TLD Directory</h1>
        <TldMenu />
      </div>
    </div>
  );
};

export default TldList;
import HowItWorks from "@/frontend/components/home/HowItWorks";
import Pricing from "@/frontend/components/home/Pricing";
import Banner from "@/frontend/components/home/Banner";
import PublicPlans from "@/frontend/components/home/PublicPlans";

export default function Home() {
  return (
    <div className="scroll-m-5 w-full">
      <Banner />
      <HowItWorks />
      <PublicPlans />
      <Pricing />
    </div>
  );
}

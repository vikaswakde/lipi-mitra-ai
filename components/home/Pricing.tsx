import { ArrowRight, CheckIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {};

const Pricing = (props: Props) => {
  const plansMap = [
    {
      id: "basic",
      name: "Basic",
      description: "Get started with LipiMitra AI!",
      price: "10",
      items: ["3 Blog Posts", "3 Transcriptions"],
    },
    {
      id: "pro",
      name: "Pro",
      description: "All Blog Posts, Let's Go!",
      price: "19.99",
      items: ["Unlimited Blog Posts", "Umlimited Transcriptions"],
    },
  ];
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-12 lg:px-0">
        <div className="flex items-center justify-center w-full pb-6 pt-3">
          <h2 className="uppercase font-bold text-xl mb-8 text-purp le-600">
            Pricing
          </h2>
        </div>
        <div className="relative flex flex-col justify-center lg:flex-row items-center lg:items-stretch gap-8">
          {plansMap.map(({ name, price, description, items, id }, idx) => (
            <div className="relative w-full max-w-lg" key={idx}>
              <div
                className={cn(
                  "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8  border-[1px] border-gray-500/20 rounded-2xl",
                  id === "pro" && "border-violet-500 gap-5 border-2"
                )}
              >
                <div className="flex flex-col justify-center items-start gap-4">
                  <div>
                    <p className="font-bold text-lg lg:text-xl capitalize">
                      {name}
                    </p>
                    <p className="text-base/80 mt-2">{description}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-5xl tracking-tight font-extrabold">
                      ${price}
                    </p>
                    <div className="flex flex-col justify-end mb-[4px]">
                      <p className="text-sm text-base-content/60 uppercase font-semibold">
                        USD
                      </p>
                      <p className="text-xs text-base-content/60">/month</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckIcon size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    <Button
                      variant="link"
                      className={cn(
                        "border-2 rounded-full bg-black text-gray-100",
                        id === "pro" && "padding-2 border-amber-200"
                      )}
                    >
                      <Link href="/" className="flex gap-1 items-center">
                        Get LipiMitraAI
                        <ArrowRight
                          size={22}
                          className="animate-pulse transition-colors ml-1"
                        />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

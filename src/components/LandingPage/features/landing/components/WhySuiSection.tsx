import React from 'react';
import { ScrollReveal } from '../../../components/ui';
import { Zap, Shield, Users, Layers, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const features = [
  {
    title: "Unmatched Speed",
    description: "Sui's object-centric architecture enables parallel execution, delivering sub-second finality and 297,000 peak TPS.",
    icon: Zap,
    className: "md:col-span-2",
  },
  {
    title: "Move Security",
    description: "Built on Move, a programming language designed for safe and secure digital asset management.",
    icon: Shield,
    className: "md:col-span-1",
  },
  {
    title: "Web2 Experience",
    description: "Onboard users seamlessly with zkLogin (Google/FB auth) and Sponsored Transactions.",
    icon: Users,
    className: "md:col-span-1",
  },
  {
    title: "Dynamic Assets",
    description: "All assets on Sui are objects that can live, mutate, and evolve on-chain.",
    icon: Layers,
    className: "md:col-span-2",
  },
];

export const WhySuiSection: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sui-blue-900/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal mode="fade-up" className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6">
            Why Build on Sui?
          </h2>
          <p className="text-lg text-sui-gray-400">
            The first Layer 1 blockchain designed from the ground up to enable creator and developer experiences that cater to the next billion users in web3.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.1}
              className={cn(
                "group relative p-8 bg-sui-gray-900/40 border border-sui-gray-800/50 hover:border-sui-blue-500/30 transition-all duration-300",
                feature.className
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sui-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 p-3 w-fit rounded-xl text-sui-blue-400 group-hover:text-sui-blue-300 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-sui-blue-200 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sui-gray-400 leading-relaxed mb-6 flex-grow">
                  {feature.description}
                </p>

                <div className="flex items-center text-sm font-medium text-sui-gray-500 group-hover:text-white transition-colors">
                  Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

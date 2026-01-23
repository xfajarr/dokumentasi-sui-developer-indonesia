import React from 'react';
import { ScrollReveal } from '../../../components/ui';
import { MessageCircle, Github, Twitter, ExternalLink, Users } from 'lucide-react';

const socialLinks = [
  {
    name: "Global Community",
    description: "Join the official Sui Discord server to connect with developers worldwide.",
    icon: MessageCircle,
    href: "https://discord.gg/sui",
    color: "hover:bg-[#5865F2]",
    textColor: "group-hover:text-white"
  },
  {
    name: "Sui Indonesia",
    description: "Bergabung dengan komunitas lokal Sui Indonesia di Telegram.",
    icon: Users,
    href: "https://t.me/Sui_Blockchain_Indonesian",
    color: "hover:bg-[#229ED9]",
    textColor: "group-hover:text-white"
  },
  {
    name: "Developer Forums",
    description: "Discuss technical topics, propose SIPs, and find answers.",
    icon: Github,
    href: "https://forums.sui.io/",
    color: "hover:bg-[#333]",
    textColor: "group-hover:text-white"
  },
];

export const CommunitySection: React.FC = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-sui-gray-900 to-sui-gray-900/50 border border-sui-gray-800 p-8 md:p-16 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sui-blue-600/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
          
            <ScrollReveal 
              mode="fade-up" 
              className="relative z-10 grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Join the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sui-blue-400 to-cyan-400">
                    Global Community
                  </span>
                </h2>
                <p className="text-lg text-sui-gray-400 mb-8 max-w-md">
                  Be part of the next generation of digital asset ownership. Connect, build, and grow with thousands of developers and enthusiasts.
                </p>
                
                <div className="flex flex-wrap gap-4">
                   <a 
                     href="https://discord.gg/sui" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="px-6 py-3 bg-white text-black font-semibold hover:bg-sui-gray-100 transition-colors flex items-center"
                   >
                     <MessageCircle className="w-5 h-5 mr-2" />
                     Join Discord
                   </a>
                   <a 
                     href="https://twitter.com/SuiNetwork" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="px-6 py-3 bg-sui-gray-800 text-white font-semibold hover:bg-sui-gray-700 transition-colors flex items-center border border-sui-gray-700"
                   >
                     <Twitter className="w-5 h-5 mr-2" />
                     Follow Updates
                   </a>
                </div>
              </div>

              <div className="grid gap-4">
                {socialLinks.map((link, idx) => (
                  <ScrollReveal
                    key={idx}
                    delay={idx * 0.1}
                    className="block"
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block p-6 bg-sui-gray-950 border border-sui-gray-800 transition-all duration-300 ${link.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <link.icon size={24} />
                          <div>
                            <h3 className={`font-semibold text-white ${link.textColor} transition-colors`}>{link.name}</h3>
                            <p className={`text-sm text-sui-gray-500 ${link.textColor} transition-colors opacity-80`}>{link.description}</p>
                          </div>
                        </div>
                        <ExternalLink className={`w-5 h-5 text-sui-gray-600 ${link.textColor} transition-colors`} />
                      </div>
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

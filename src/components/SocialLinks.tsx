import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTelegram, 
  faWhatsapp, 
  faYoutube, 
  faVk, 
  faTwitter, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types/database';

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
  showInstagramDisclaimer?: boolean;
}

export function SocialLinks({ className = '', iconClassName = '', showInstagramDisclaimer = false }: SocialLinksProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      setSettings(data);
    }
    fetchSettings();
  }, []);

  if (!settings) return null;

  const socialLinks = [
    { show: settings.show_telegram, icon: faTelegram, url: settings.telegram_url, label: 'Telegram' },
    { show: settings.show_whatsapp, icon: faWhatsapp, url: settings.whatsapp_url, label: 'WhatsApp' },
    { show: settings.show_youtube, icon: faYoutube, url: settings.youtube_url, label: 'YouTube' },
    { show: settings.show_vk, icon: faVk, url: settings.vk_url, label: 'ВКонтакте' },
    { show: settings.show_twitter, icon: faTwitter, url: settings.twitter_url, label: 'Twitter' },
    { show: settings.show_instagram, icon: faInstagram, url: settings.instagram_url, label: 'Instagram' },
    { show: settings.show_email, icon: faEnvelope, url: `mailto:${settings.email}`, label: 'Email' },
    { show: settings.show_phone, icon: faPhone, url: `tel:${settings.phone}`, label: 'Телефон' }
  ];

  const visibleLinks = socialLinks.filter(link => link.show && link.url);

  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-4">
        {visibleLinks.map((link, index) => (
          <a
            key={index}
            href={link.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 hover:text-[#00ff8c] transition-colors ${iconClassName}`}
            title={link.label}
          >
            <FontAwesomeIcon icon={link.icon} />
          </a>
        ))}
      </div>
      {showInstagramDisclaimer && settings.show_instagram && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          *Meta Platforms Inc. (соцсети Facebook*, Instagram*) признана экстремистской, ее деятельность запрещена на территории России.
        </p>
      )}
    </div>
  );
}
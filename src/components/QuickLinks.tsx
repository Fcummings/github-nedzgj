import { Link } from 'react-router-dom';
import { useScrollToSection } from '@/hooks/useScrollToSection';

interface QuickLink {
  label: string;
  sectionId: string;
}

const links: QuickLink[] = [
  { label: 'For Individuals', sectionId: 'individuals' },
  { label: 'For Businesses', sectionId: 'businesses' },
  { label: 'How It Works', sectionId: 'how-it-works' },
  { label: 'FAQ', sectionId: 'faq' },
];

export default function QuickLinks() {
  const scrollToSection = useScrollToSection();

  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.sectionId}>
          <button
            onClick={() => scrollToSection(link.sectionId)}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
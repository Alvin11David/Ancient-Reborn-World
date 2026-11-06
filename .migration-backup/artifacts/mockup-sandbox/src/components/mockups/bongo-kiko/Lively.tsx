import BongoKikoPage from './_shared/BongoKikoPage';
import './_group.css';
import './Lively.css';
import { Router, useLocation } from './_shared/router';

type Page = 'intro' | 'characters' | 'bongo' | 'kiko' | 'adventures';

const pageByPath: Record<string, Page> = {
  '/bongo-kiko': 'intro',
  '/bongo-kiko/characters': 'characters',
  '/bongo-kiko/characters/bongo': 'bongo',
  '/bongo-kiko/characters/kiko': 'kiko',
  '/bongo-kiko/adventures': 'adventures',
};

function PageFlow() {
  const [location] = useLocation();
  return <BongoKikoPage page={pageByPath[location] ?? 'intro'} />;
}

export default function Lively() {
  return <Router><PageFlow /></Router>;
}

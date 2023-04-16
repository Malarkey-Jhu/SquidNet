import { IconMale, IconFemale, IconHelpCircle } from '@douyinfe/semi-icons';

function GenderIcon({ gender }: { gender: number }) {
  if (gender === 1) return <IconMale style={{ color: 'lightblue' }} />;
  if (gender === 2) return <IconFemale style={{ color: 'lightpink' }} />;
  return <IconHelpCircle />;
}

export default GenderIcon;

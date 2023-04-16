import { Empty } from '@douyinfe/semi-ui';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';

const MyEmpty = ({
  title,
  desc,
  className = '',
}: {
  title: string;
  desc: string;
  className?: string;
}) => {
  return (
    <Empty
      className={className}
      image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
      darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
      title={title}
      description={desc}
    />
  );
};

export default MyEmpty;

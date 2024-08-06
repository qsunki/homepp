import React from 'react';
import LivePlayer from './LivePlayer';
import RecordedPlayer from './RecordedPlayer';

interface DetailPlayerProps {
  isLive?: boolean;
  showDetails?: boolean;
}

const DetailPlayer: React.FC<DetailPlayerProps> = ({
  isLive = false,
  showDetails = false,
}) => {
  return (
    <div className="w-2/3 pr-4 relative">
      {isLive ? <LivePlayer /> : <RecordedPlayer showDetails={showDetails} />}
    </div>
  );
};

export default DetailPlayer;

import React from 'react';
import StepEvent from './StepEvent';

const StepEventExample: React.FC = () => {
  const events = [
    {
      id: '1',
      title: 'Event Planning',
      description: 'Initial consultation and planning phase',
      content: '<p>This is the first step where we discuss your event requirements and preferences.</p><ul><li>Initial consultation</li><li>Requirement analysis</li><li>Budget planning</li></ul>'
    },
    {
      id: '2',
      title: 'Venue Selection',
      description: 'Finding the perfect location for your event',
      content: '<p>Based on your preferences, we will scout and select the ideal venue for your event.</p><ul><li>Venue scouting</li><li>Site visits</li><li>Contract negotiation</li></ul>'
    },
    {
      id: '3',
      title: 'Catering & Decor',
      description: 'Food and decoration arrangements',
      content: '<p>Coordinating all catering and decoration elements to match your vision.</p><ul><li>Catering selection</li><li>Menu planning</li><li>Decor theme</li></ul>'
    },
    {
      id: '4',
      title: 'Final Execution',
      description: 'Executing the event flawlessly',
      content: '<p>On the day of the event, our team manages everything to ensure success.</p><ul><li>Day-of coordination</li><li>Vendor management</li><li>Guest services</li></ul>'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Step Event Component Example</h1>
      <StepEvent events={events} />
    </div>
  );
};

export default StepEventExample;

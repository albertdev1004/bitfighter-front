/* eslint-disable @typescript-eslint/no-explicit-any */

import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with your token
mixpanel.init('b1c2f5c6c5fd5e638f023c22af5e89b1');

const envCheck = true;

// Define types for Mixpanel actions and properties
interface MixpanelProps {
  [key: string]: any;
}

interface Actions {
  identify: (id: string) => void;
  alias: (id: string) => void;
  track: (name: string, props?: MixpanelProps) => void;
  people: {
    set: (props: MixpanelProps) => void;
  };
}

const actions: Actions = {
  identify: (id: string) => {
    if (envCheck) mixpanel.identify(id);
  },
  alias: (id: string) => {
    if (envCheck) mixpanel.alias(id);
  },
  track: (name: string, props?: MixpanelProps) => {
    if (envCheck) mixpanel.track(name, props);
  },
  people: {
    set: (props: MixpanelProps) => {
      if (envCheck) mixpanel.people.set(props);
    },
  },
};

const Mixpanel = actions;
export default Mixpanel;

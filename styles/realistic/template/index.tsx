import {registerRoot, Composition} from 'remotion';
import React from 'react';
import {Video, TOTAL} from './Video';
const Root = () => <Composition id="Main" component={Video} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />;
registerRoot(Root);

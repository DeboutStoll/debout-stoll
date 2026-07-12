import { Config } from '@remotion/cli/config';

// Render defaults. See https://remotion.dev/docs/config
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto
Config.setChromiumOpenGlRenderer('angle');

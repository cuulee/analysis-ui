# Preparing data inputs for Scenario Editor

Conveyal Analysis relies on [GTFS](https://developers.google.com/transit/gtfs/) feeds, .zip files with information about transit networks and schedules. Most transit agencies produce GTFS feeds to power customer-facing trip planning applications, but they are also useful for analysis. A first step is to gather GTFS files for the transit agencies whose service will be modified in your scenarios.

Once you've gathered GTFS data, you can log into Conveyal Analysis.

First, set up a new region by clicking on the green button, or go to an existing region for which you already have projects.

When setting up a new region, you specify a name as well as boundaries. Based on the specified boundaries, population and employment data will be automatically downloaded (for US cities) from the Census Bureau's LEHD LODES, and road network data will be automatically downloaded from OpenStreetMap. It is also possible to upload custom OpenStreetMap in this view.

After the shared settings for a region are configured, you can upload the GTFS feeds you prepared above. Select "Create a new Project." Here you can create projects based on a bundle of GTFS feeds uploaded for your region. Since you have not yet uploaded any GTFS, choose "Create a bundle." Note that, if you have multiple GTFS feeds, you can upload all of them at once (just make sure you have added unique feed IDs to all of them). Click "Create a bundle" to upload your feeds. "Uploading..." will appear; it may take several minutes to upload the bundle. Once it's complete, you will be returned to the "Create a Project" page, where you can select the bundle you just uploaded and give your project a name, and then click "Create new Project."

You are now ready to move on to <a href="/edit-scenario/">editing your scenarios</a>

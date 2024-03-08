# Obsidian Geocoding Properties

Insert address / location data from geocoding APIs as Obsidian properties.

## Usage

The plugin operates on the active note. It queries the configured geocoding API using one of the following search terms, in order of priority:

-   The current note's `address` property, if set
-   The current note's `title` property, if set
-   The current note's name

The plugin provides two commands:

-   `Insert properties into current note`: prompts you to edit the search term and confirm before querying the API. If a term is too broad, the API may return too many results or zero results, so it often helps to add additional information (city, state, country) to the term.
-   `Insert properties into current note (no confirmation)`: skips confirmation and queries the API directly using the search term.

After selecting a result, the active note's frontmatter will be updated with the properties specified in [the plugin's settings](#properties).

## Settings

### Properties

Each property can be enabled or disabled, and you can also specify a custom key for each property:

-   `address`: The formatted address returned by the API (format is not guaranteed and varies by API)
-   `lat`: The latitude of the location
-   `lng`: The longitude of the location
-   `location`: The coordinates of the location in an [obsidian-leaflet](https://github.com/javalent/obsidian-leaflet)-compatible `[lat, lng]` format
-   `map_link`: A link to an online map to the location using the configured [map provider](#map-provider)
-   `map_view_link`: A link in in an [obsidian-map-view](https://github.com/esm7/obsidian-map-view)-compatible `[](geo:lat,lng)` format

### Property settings

#### Override existing properties

Controls whether existing properties should be overwritten when inserting (defaults to false).

#### Map provider

Controls which map provider should be used when inserting the `map_link` property (defaults to Google Maps):

-   [Google Maps](https://www.google.com/maps)
-   [Apple Maps](https://maps.apple.com)
-   [OpenStreetMap](https://www.openstreetmap.org)

### API settings

#### API provider

The plugin currently supports two geocoding APIs:

##### [Free Geocoding API](https://geocode.maps.co)

This is the default API. It's free, but accuracy is not guaranteed, and you may be subjected to rate limiting as a free user. (It also tends to show multiple entries for the same location.)

You'll need to [register an account](https://geocode.maps.co/join/) and get a free API key to use this service.

##### [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview)

**This is a paid API** (the cost per request is low, but it's not free). Setup is non-trivial, but accuracy is higher and rate limits are more generous.

You'll need to set up a Google Cloud project and enable the Geocoding API. You'll also need to [create an API key](https://developers.google.com/maps/documentation/geocoding/get-api-key) and set up a billing account and [enable billing](https://developers.google.com/maps/documentation/geocoding/get-api-key#premium-auth) for your project.

#### API key

You'll need to set your API key here.

**Please be careful with your API key!** I do not have access to the key, but it's stored as plaintext in your Obsidian vault, and anyone with access to the key can make requests on your behalf (which will be charged to your account if you've set up billing for the configured API).

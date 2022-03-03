import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
      };
    console.log('handleScriptLoadhandleScriptLoad');
 const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: "in" },
    fields: ["address_components","formatted_address", "geometry", "icon", "name"],
    strictBounds: false,
    types: ["establishment"],
  };
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,options
    /* { types: ["(cities)"], componentRestrictions: { country: "in" } } */
  );
  autoComplete.setFields(["address_components", "formatted_address","geometry","place_id","types"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {

  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  console.log('UUUUUU',addressObject);
  console.log('lat',autoComplete.getPlace().geometry.location.lat()) //for the latitude
  console.log('lng',autoComplete.getPlace().geometry.location.lng()) //for the latitude

}

function GoogleAuto() {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyBWw7nuWmfNgSvo1yiueaRRLX37726AsWU&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  console.log('query',query);

  return (
    <div className="search-location-input">
      <input
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />
    </div>
  );
}

export default GoogleAuto;
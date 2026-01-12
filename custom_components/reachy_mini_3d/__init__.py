"""Reachy Mini 3D Card Integration for Home Assistant."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.resources import ResourceStorageCollection
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

DOMAIN = "reachy_mini_3d"

# Static paths for serving assets
STATIC_PATH = "/reachy_mini_3d_static"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Reachy Mini 3D component."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Reachy Mini 3D from a config entry."""
    
    # Get the path to our static files
    component_path = Path(__file__).parent
    www_path = component_path / "www"
    
    # Register static paths for serving JS, STL, URDF files
    await hass.http.async_register_static_paths([
        StaticPathConfig(STATIC_PATH, str(www_path), True)
    ])
    
    _LOGGER.info("Registered static path: %s -> %s", STATIC_PATH, www_path)
    
    # Register the Lovelace resource
    js_url = f"{STATIC_PATH}/ha-reachy-mini-card.js"
    
    # Try to add the resource to Lovelace
    try:
        resources: ResourceStorageCollection = hass.data["lovelace"]["resources"]
        
        # Check if resource already exists
        existing = [r for r in resources.async_items() if r.get("url") == js_url]
        if not existing:
            await resources.async_create_item({
                "url": js_url,
                "type": "module"
            })
            _LOGGER.info("Registered Lovelace resource: %s", js_url)
        else:
            _LOGGER.debug("Lovelace resource already registered: %s", js_url)
    except Exception as err:
        _LOGGER.warning(
            "Could not auto-register Lovelace resource. "
            "Please add manually: %s (error: %s)", 
            js_url, err
        )
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return True

"""Reachy Mini 3D Card Integration for Home Assistant."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

DOMAIN = "reachy_mini_3d"
STATIC_PATH = "/reachy_mini_3d_static"
JS_URL = f"{STATIC_PATH}/ha-reachy-mini-card.js"


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
    
    # Register the card JS as extra frontend resource
    # This is the most reliable method - works without needing lovelace storage mode
    add_extra_js_url(hass, JS_URL)
    _LOGGER.info("Registered frontend JS: %s", JS_URL)
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return True

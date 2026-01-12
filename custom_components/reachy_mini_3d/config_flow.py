"""Config flow for Reachy Mini 3D Card integration."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow
from homeassistant.data_entry_flow import FlowResult

DOMAIN = "reachy_mini_3d"


class ReachyMini3DConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Reachy Mini 3D Card."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(
                title="Reachy Mini 3D Card",
                data={}
            )

        return self.async_show_form(step_id="user")

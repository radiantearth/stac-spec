import re
import urllib.parse
from re import Match
from typing import override

from mkdocs.config.base import Config
from mkdocs.config.config_options import Type
from mkdocs.config.defaults import MkDocsConfig
from mkdocs.plugins import BasePlugin
from mkdocs.structure.files import Files
from mkdocs.structure.pages import Page

JSON_SCHEMA_LINK_REGEX = re.compile(r"\((.*?json-schema/.*?)\)")


class StacSpecPluginConfig(Config):
    spec_version: Type[str] = Type(str)


class StacSpecPlugin(BasePlugin[StacSpecPluginConfig]):
    @override
    def on_page_markdown(
        self, markdown: str, /, *, page: Page, config: MkDocsConfig, files: Files
    ) -> str | None:
        def rewrite_json_schema_url(match: Match[str]) -> str:
            url = urllib.parse.urljoin(
                f"https://schemas.stacspec.org/v{self.config.spec_version}/",
                urllib.parse.urljoin(page.file.src_path, match.group(1)).lstrip("/"),
            )
            return f"({url})"

        return JSON_SCHEMA_LINK_REGEX.sub(rewrite_json_schema_url, markdown)

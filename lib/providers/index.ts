import { anilist } from "./anilist";
import type { CatalogProvider } from "./types";

export const catalog: CatalogProvider = anilist;

export type {
  CatalogItem,
  CatalogProvider,
  Character,
  CharacterEdge,
  CharactersResult,
  DetailItem,
  DiscoverOptions,
  ExternalLink,
  Ranking,
  RelationEdge,
  StaffMember,
  StreamingEpisode,
  Tag,
  VoiceActor,
} from "./types";

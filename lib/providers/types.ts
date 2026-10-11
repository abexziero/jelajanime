export type Tag = {
  name: string;
  rank: number;
  category?: string | null;
  isMediaSpoiler?: boolean;
  isGeneralSpoiler?: boolean;
};

export type CatalogItem = {
  id: number;
  title: string;
  titleNative?: string | null;
  synopsis?: string | null;
  coverImage: string;
  bannerImage?: string | null;
  coverColor?: string | null;
  score?: number | null;
  year?: number | null;
  format?: string | null;
  status?: string | null;
  episodes?: number | null;
  genres: string[];
  trailerYoutubeId?: string | null;
  // Fakta (F-02 lanjutan)
  source?: string | null;
  country?: string | null;
  popularity?: number | null;
  favourites?: number | null;
  hashtag?: string | null;
  synonyms?: string[];
  startDate?: string | null;
  endDate?: string | null;
  tags?: Tag[];
};

export type Character = {
  name: string;
  image?: string | null;
};

export type ExternalLink = {
  site: string;
  url: string;
  type?: string | null;
};

export type VoiceActor = {
  name: string;
  image?: string | null;
  language?: string | null;
};

export type CharacterEdge = {
  id: number;
  name: string;
  image?: string | null;
  role?: string | null;
  description?: string | null;
  gender?: string | null;
  age?: string | null;
  bloodType?: string | null;
  favourites?: number | null;
  voiceActors: VoiceActor[];
};

export type StaffMember = {
  id: number;
  name: string;
  image?: string | null;
  role?: string | null;
};

export type CharactersResult = {
  animeTitle: string;
  characters: CharacterEdge[];
  staff: StaffMember[];
};

export type RelationEdge = {
  relationType: string;
  id: number;
  title: string;
  format?: string | null;
};

export type Ranking = {
  rank: number;
  type: string;
  context: string;
  allTime: boolean;
};

export type StreamingEpisode = {
  title: string;
  thumbnail?: string | null;
  site?: string | null;
};

export type DetailItem = CatalogItem & {
  characters: Character[];
  recommendations: CatalogItem[];
  duration?: number | null;
  studio?: string | null;
  season?: string | null;
  externalLinks: ExternalLink[];
  relations: RelationEdge[];
  rankings: Ranking[];
  streamingEpisodes: StreamingEpisode[];
  nextEpisode?: number | null;
};

export type CatalogProvider = {
  trending(page?: number, perPage?: number): Promise<CatalogItem[]>;
  popular(page?: number, perPage?: number): Promise<CatalogItem[]>;
  topRated(page?: number, perPage?: number): Promise<CatalogItem[]>;
  upcoming(page?: number, perPage?: number): Promise<CatalogItem[]>;
  airing(page?: number, perPage?: number): Promise<CatalogItem[]>;
  search(
    query: string,
    page?: number,
    perPage?: number,
  ): Promise<CatalogItem[]>;
  getDetail(id: number): Promise<DetailItem | null>;
  getCharacters(id: number): Promise<CharactersResult | null>;
  getGenres(): Promise<string[]>;
  discover(options?: DiscoverOptions): Promise<CatalogItem[]>;
};

export type DiscoverOptions = {
  genre?: string;
  format?: string;
  status?: string;
  year?: number;
  sort?: string;
  page?: number;
  perPage?: number;
};

export type Image = {
  publicId: string;
  url: string;
  location: {
    lat: number;
    lon: number;
  };
  caption: string;
};

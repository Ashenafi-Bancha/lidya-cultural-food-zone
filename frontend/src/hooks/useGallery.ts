import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../services/gallery.service';

export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: galleryService.getItems,
  });
};

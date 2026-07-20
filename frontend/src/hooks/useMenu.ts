import { useQuery } from '@tanstack/react-query';
import { menuService } from '../services/menu.service';

export const useMenu = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: menuService.getItems,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: menuService.getCategories,
  });
};

import { createRouter, createWebHistory } from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import HomeView from '../views/HomeView.vue';
import RoomEntryView from '../views/RoomEntryView.vue';
import WaitingRoomView from '../views/WaitingRoomView.vue';
import InRoomView from '../views/InRoomView.vue';

const routes = [
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('../views/GalleryView.vue'),
    meta: { title: '画廊 · God of Avalon' }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/createroom',
    name: 'createroom',
    redirect: to => ({ path: '/room', query: to.query }),
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/joinroom',
    name: 'joinroom',
    redirect: to => ({ path: '/room', query: to.query }),
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/room',
    name: 'room',
    component: RoomEntryView,
    meta: { title: 'God of Avalon' }
  },
  {
    path: '/waitingroom',
    name: 'waitingroom',
    component: WaitingRoomView,
    meta: {
      title: 'God of Avalon'
    }
  },
  {
    path: '/inroom',
    name: 'inroom',
    component: InRoomView,
    meta: {
      title: 'God of Avalon'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;

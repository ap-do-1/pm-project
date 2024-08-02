import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/HomeView.vue'

const routes = [
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/404View.vue')
  },
  {
    meta: {
      title: 'dashboard',
      requiresAuth: true
    },
    path: '/',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Projects',
      requiresAuth: true
    },
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/ProjectView.vue')
  },

  {
    meta: {
      title: 'KanbanBoard',
      requiresAuth: true
    },
    path: '/KanbanBoard/:id',
    name: 'KanbanBoard',
    component: () => import('@/views/KanbanBoardView.vue')
  },

  {
    meta: {
      title: 'Create Project',
      requiresAuth: true
    },
    path: '/CreateProject',
    name: 'CreateProject',
    component: () => import('@/views/CreateProject.vue')
  },
  {
    meta: {
      title: 'Edit Project',
      requiresAuth: true
    },
    path: '/EditProject/:id',
    name: 'EditProject',
    component: () => import('@/views/EditProjectView.vue')
  },
  {
    meta: {
      title: 'Profile',
      requiresAuth: true
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },

  {
    meta: {
      title: 'Login',
      requiresGuest: true
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },

  {
    meta: {
      title: 'Register',
      requiresGuest: true
    },
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue')
  },

  {
    path: '/logout',
    name: 'logout',
    meta: { requiresAuth: true }
    // Component or redirect to perform the logout action
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

//navigation guard
router.beforeEach(async (to, from, next) => {
  const store = useAuthStore()

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && store.isAuthenticated) {
    next({ name: 'dashboard' })
  } else if (to.name === 'logout') {
    await store.logout()
    next({ name: 'login' })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  document.title = `${to.meta.title} | Vue Task Manager`
})

export default router

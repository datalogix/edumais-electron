<script setup lang="ts">
import flipBook, { processContent } from './lib/book'

const route = useRoute()
const modalInformations = ref(false)
const modalResources = ref(false)

const { data } = await useApi(`books/${route.params.book}`).json()

const book = ref(data.value.book)
const pages = ref(data.value.pages)
const resources = ref(data.value.resources)

onMounted(() => {
  flipBook(
    pages.value,
    book.value.id,
    !!book.value.single,
    book.value.width ? book.value.width : (book.value.single ? 805 : 461),
    book.value.height ? book.vale.height : 600
  )
})
</script>

<template>
  <PDialog
    v-if="book.isbn || book.description"
    header="Informações"
    v-model:visible="modalInformations"
    :style="{width: '50vw'}"
    :modal="true"
  >
    <div v-if="book.isbn" class="mb-6">
      <label>ISBN</label>
      <div
        class="mt-2 border py-3 px-4 rounded-md border-gray-300"
        v-html="book.isbn"
      />
    </div>

    <div v-if="book.description" class="mb-6">
      <label>Descriçao</label>
      <div
        class="mt-2 border py-3 px-4 rounded-md border-gray-300 ql-editor"
        v-html="book.description"
      />
    </div>
  </PDialog>
  <PDialog
    v-if="resources.length"
    header="Recursos"
    v-model:visible="modalResources"
    :style="{width: '50vw'}"
    :modal="true"
  >
    <div class="grid grid-cols-2 gap-6">
      <PButton
        v-for="resource in resources"
        :key="resource"
        @click="processContent(resource)"
        class="p-button-secondary p-button-outlined"
      >
        <span class="flex items-center space-x-2">
          <IconMdiVolume v-if="resource.type.includes('audio')" />
          <IconMdiVideo v-if="resource.type.includes('video')" />
          <IconMdiImage v-if="resource.type.includes('image')" />
          <IconMdiLink v-if="resource.type.includes('link')" />
          <IconMdiText v-if="resource.type.includes('textarea')" />
          <IconMdiFileDownloadOutline v-if="resource.type.includes('file')" />
          <span>{{ resource.title }}</span>
        </span>
      </PButton>
    </div>
  </PDialog>
  <div class="fixed grid content-center bg-white inset-0 loading z-[9999998]">
    <div class="space-y-6">
      <LayoutLogo />
      <Loading />
    </div>
  </div>
  <div class="min-h-screen h-full flex flex-col bg-fixed bg-center bg-no-repeat bg-cover bg-gray-50 text-gray-700">
    <header class="flex flex-col items-center justify-between p-2 md:flex-row bg-white shadow space-y-2 md:space-y-0">
      <div>
        <LayoutLogo class="!max-h-20" />
      </div>
      <div class="flex-1 py-2">
        <h1 class="mb-4 text-xl text-center text-secondary">
          {{ book.name }}
        </h1>
        <div class="flex items-center justify-center space-x-2">
          <button type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none prev focus:outline-none hover:opacity-70">
            <IconMdiChevronLeft />
          </button>
          <span>Page</span>
          <input value="1" type="number" class="w-20 px-3 py-2 text-center border rounded page-input" />
          <span>of</span>
          <span class="total-pages">{{ pages.length }}</span>
          <button type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none next focus:outline-none hover:opacity-70">
            <IconMdiChevronRight />
          </button>
        </div>
      </div>
      <div class="flex items-center justify-end space-x-2">
        <button v-if="book.isbn || book.description" @click="modalInformations = true" type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none focus:outline-none hover:opacity-70">
          <IconMdiHelp />
        </button>
        <button v-if="resources.length" @click="modalResources = true" type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none focus:outline-none hover:opacity-70">
          <IconMdiPackageVariantClosedPlus />
        </button>
        <!--
        <button type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none eraser focus:outline-none hover:opacity-70">
          <IconMdiEraser />
        </button>
        <button type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none pen focus:outline-none hover:opacity-70">
          <IconMdiPencil />
        </button>
        -->
        <button type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none zoom-in focus:outline-none hover:opacity-70">
          <IconBiZoomIn />
        </button>
        <button type="button" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none zoom-out focus:outline-none hover:opacity-70">
          <IconBiZoomOut />
        </button>
        <router-link :to="{ name: 'books' }" class="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full outline-none focus:outline-none hover:opacity-70">
          <IconMdiClose />
        </router-link>
      </div>
    </header>
    <div class="flex-1 book-viewport">
      <div ignore="1" class="flex items-center justify-center prev previous-button">
        <IconMdiChevronLeft class="w-20 h-20" />
      </div>
      <div ignore="1" class="flex items-center justify-center next next-button">
        <IconMdiChevronRight class="w-20 h-20" />
      </div>
      <div class="absolute m-auto top-1/2 left-1/2">
        <div class="relative book"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body {
  margin: 0 !important;
}

.page-input {
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
}

.book-viewport {
    .page {
        background-color: #fff;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        box-shadow:0 0 20px rgba(0,0,0,0.2);

        img {
            user-select: none;
            margin:0;
        }
    }

    .zoomer .content {
        display: none;
    }

    .loader {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shadow {
        box-shadow: 0 0 20px #ccc;
    }

    .next-button,
    .previous-button {
        cursor: pointer;
        width: 60px;
        height: 100%;
        position: absolute;
        top:0
    }

    .next-button {
        right: 0;
        border-radius: 0 15px 15px 0;
    }

    .previous-button {
        left: 0;
        border-radius: 15px 0 0 15px;
    }

    .animated {
        transition: margin-left 0.5s;
    }

    .content {
        position: absolute;
        color: #000;
        z-index: 40;

        audio, video {
            &::-internal-media-controls-download-button {
                display:none;
            }

            &::-webkit-media-controls-enclosure {
                overflow:hidden;
            }

            &::-webkit-media-controls-panel {
                width: calc(100% + 30px);
            }
        }

        .content-text {
          background-color: rgba(255, 255, 255, 1);
          padding: 0.5rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          border-radius: 0.25rem;
        }

        .content-icon {
          cursor: pointer;
          background-color: rgba(255, 255, 255, 1);
          width: 2rem;
          height: 2rem;
          border-width: 1px;
          border-color: currentColor;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          --un-shadow: var(--un-shadow-inset) 0 25px 50px -12px var(--un-shadow-color, rgba(0, 0, 0, 0.25));
          box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
          --un-ring-offset-width: 1px;
          --un-ring-width: 2px;
          --un-ring-offset-shadow: var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);
          --un-ring-shadow: var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);
          box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
        }
    }

    .canvas {
      position: absolute;
      z-index: 30;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
    }
}

.content-display {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  inset: 0rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999999;

  .content-box {
    padding: 1rem;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 0.25rem;
    position: relative;
  }

  .content-drag {
    cursor: move;
    background-color: rgba(255, 255, 255, 1);
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }
}
</style>

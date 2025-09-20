import fs from "fs/promises"
import path from "path"

export interface ContentData {
  pages: {
    [key: string]: {
      [key: string]: any
    }
  }
}

class ContentManager {
  private contentPath = path.join(process.cwd(), "data", "content.json")

  async getContent(): Promise<ContentData> {
    try {
      const data = await fs.readFile(this.contentPath, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      console.error("Erreur lors de la lecture du contenu:", error)
      return { pages: {} }
    }
  }

  async updateContent(content: ContentData): Promise<void> {
    try {
      await fs.writeFile(this.contentPath, JSON.stringify(content, null, 2))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du contenu:", error)
      throw error
    }
  }

  async updatePageContent(page: string, content: any): Promise<void> {
    const currentContent = await this.getContent()
    currentContent.pages[page] = { ...currentContent.pages[page], ...content }
    await this.updateContent(currentContent)
  }

  async getPageContent(page: string): Promise<any> {
    const content = await this.getContent()
    return content.pages[page] || {}
  }
}

export const contentManager = new ContentManager()

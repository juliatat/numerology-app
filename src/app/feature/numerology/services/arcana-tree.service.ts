import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {shareReplay} from 'rxjs';
import type {ArcanaTreeRoot, ArcanaTreeNode, ArcanaPathDescription} from '../models/arcana-modal.model';

function isValidArcanaId(id: number): boolean {
  return Number.isInteger(id) && id >= 1 && id <= 22;
}

function isTreeNode(node: ArcanaPathDescription | ArcanaTreeNode | undefined): node is ArcanaTreeNode {
  return node != null && typeof node === 'object' && '_self' in node;
}

@Injectable({
  providedIn: 'root',
})
export class ArcanaTreeService {
  private readonly http = inject(HttpClient);

  readonly tree$ = this.http
    .get<ArcanaTreeRoot>('feature/numerology/data/arcana-tree.json')
    .pipe(shareReplay(1));

  /**
   * Gets the single description for the full matched path.
   * Order matters: 1-2-3 ≠ 1-3-2 ≠ 2-1-3.
   * Fallback: 1-2-3 → 1-2 → 1 (try shorter path from the end).
   * Returns null if no path matches.
   */
  getDescriptionByPath(tree: ArcanaTreeRoot, path: number[]): ArcanaPathDescription | null {
    if (!path.length) return null;

    for (let len = path.length; len >= 1; len--) {
      const subPath = path.slice(0, len);
      const desc = this.traversePath(tree, subPath);
      if (desc) return desc;
    }
    return null;
  }

  private traversePath(tree: ArcanaTreeRoot, path: number[]): ArcanaPathDescription | null {
    if (!path.length) return null;

    let node: ArcanaTreeNode | undefined = tree[String(path[0])];
    if (!node?._self) return null;

    for (let i = 1; i < path.length; i++) {
      const arcanaId = path[i];
      if (!isValidArcanaId(arcanaId)) return null;

      const next: ArcanaPathDescription | ArcanaTreeNode | undefined = node[String(arcanaId)];
      if (!isTreeNode(next)) return null;

      node = next;
    }
    return node._self;
  }

  /**
   * Checks if at least one arcana in the path belongs to the provided negative karma list.
   * No karma calculation inside; list is provided externally (from karma block).
   */
  hasNegativeKarma(path: number[], negativeArcana: number[]): boolean {
    const negativeSet = new Set(negativeArcana.filter(isValidArcanaId));
    return path.some(arcana => isValidArcanaId(arcana) && negativeSet.has(arcana));
  }
}

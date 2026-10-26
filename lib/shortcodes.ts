import { FORMS_ASSETS, renderForm, renderQuiz } from '@/lib/forms';
import { renderPostGrid } from '@/lib/post-grid';

/**
 * Replaces the WordPress plugin shortcodes left in crawled pages (their
 * plugins weren't in the backup, so WordPress printed them as text):
 *   [forminator_form id="…"]  -> native checklist / form   (lib/forms.ts)
 *   [forminator_quiz id="…"]  -> native quiz               (lib/forms.ts)
 *   [ymc_filter id="…"]       -> post card grid             (lib/post-grid.ts)
 * Shortcodes for forms that no longer exist render nothing, as on the live site.
 */
export function applyShortcodes(body: string, pageTitle: string): string {
  if (!/\[(forminator_|ymc_filter)/.test(body)) return body;
  let usesForms = false;
  const out = body
    .replace(/\[forminator_form id="(\d+)"\]/g, (_, id) => {
      const html = renderForm(id, pageTitle);
      usesForms ||= !!html;
      return html;
    })
    .replace(/\[forminator_quiz id="(\d+)"\]/g, (_, id) => {
      const html = renderQuiz(id);
      usesForms ||= !!html;
      return html;
    })
    .replace(/\[ymc_filter id=['"](\d+)['"]\]/g, (_, id) => renderPostGrid(id));
  return usesForms ? FORMS_ASSETS + out : out;
}
